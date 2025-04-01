import { CreateMemoDto, UpdateMemoDto, Memo, MemoType, TagTreeNode } from './types';
import { DatabaseAdaptor } from './database-adaptor';

export class MemoApiServiceAdaptor {
  private db!: DatabaseAdaptor

  setDd(db: DatabaseAdaptor) {
    this.db = db;
  }

  async getMemos(): Promise<Memo[]> {
    const sql = 'SELECT * FROM memos ORDER BY createdAt DESC';
    return this.db.all(sql);
  }

  async getMemo(id: number): Promise<Memo> {
    const sql = 'SELECT * FROM memos WHERE id = ?';
    return this.db.get<Memo>(sql, [id]);
  }

  async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
    const { data } = createMemoDto;
    const createdAt = new Date().toISOString();

    let sql: string;
    let params: any[];
    let content = '';

    if (data.type === MemoType.NOTE) {
      sql = 'INSERT INTO memos (type, createdAt, noteContent) VALUES (?, ?, ?)';
      params = [data.type, createdAt, data.noteContent];
      content = data.noteContent || '';
    } else {
      sql = 'INSERT INTO memos (type, createdAt, bookmarkTitle, bookmarkUrl, bookmarkDescription, bookmarkIcon) VALUES (?, ?, ?, ?, ?, ?)';
      params = [
        data.type,
        createdAt,
        data.bookmarkTitle,
        data.bookmarkUrl,
        data.bookmarkDescription || null,
        data.bookmarkIcon || null
      ];
      content = data.bookmarkDescription || '';
    }

    const runResult = await this.db.run(sql, params);
    const memoId = runResult.lastID;

    // 提取标签并保存
    await this.extractAndSaveTags(content, memoId);

    return this.getMemo(memoId);
  }

  // 提取并保存标签
  private async extractAndSaveTags(content: string, memoId: number): Promise<void> {
    // 提取以#开头的标签，支持嵌套路径格式 #tag 或 #parent/child
    const tagRegex = /#([\w\/]+)/g;
    const matches = content.match(tagRegex);

    if (!matches || matches.length === 0) {
      return;
    }

    // 去重标签
    const uniqueTags = [...new Set(matches)].map(tag => tag.substring(1));

    for (const tagPath of uniqueTags) {
      // 处理可能的嵌套路径
      const tagParts = tagPath.split('/');
      let currentPath = '';
      let parentId: number | null = null;
      let tagIds: number[] = []; // 存储路径中所有标签的ID

      // 为最后一个标签单独创建一个条目（不带路径）
      const lastTagName = tagParts[tagParts.length - 1];
      let lastTagId: number | null = null;

      // 检查最后一个标签是否已存在（不带路径）
      const existingLastTag = await this.db.get<{ id: number }>('SELECT id FROM tags WHERE path = ?', [lastTagName]);

      if (existingLastTag) {
        lastTagId = existingLastTag.id;
      } else {
        // 创建最后一个标签的单独条目
        const lastTagResult = await this.db.run(
          'INSERT INTO tags (path, parentId, createdAt) VALUES (?, NULL, ?)',
          [lastTagName, new Date().toISOString()]
        );
        lastTagId = lastTagResult.lastID;
      }

      // 将最后一个标签的ID添加到列表
      if (lastTagId !== null) {
        tagIds.push(lastTagId);
      }

      // 逐级创建或获取标签
      for (let i = 0; i < tagParts.length; i++) {
        const part = tagParts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        // 检查当前路径的标签是否存在
        const existingTag = await this.db.get<{ id: number }>('SELECT id FROM tags WHERE path = ?', [currentPath]);

        if (existingTag) {
          parentId = existingTag.id;
          tagIds.push(parentId); // 添加到标签ID列表
        } else {
          // 创建新标签，关联到父标签
          const tagResult = await this.db.run(
            'INSERT INTO tags (path, parentId, createdAt) VALUES (?, ?, ?)',
            [currentPath, parentId, new Date().toISOString()]
          );
          parentId = tagResult.lastID;
          tagIds.push(parentId!); // 添加到标签ID列表
        }
      }

      // 创建备忘录与路径中所有标签的关联
      for (const tagId of tagIds) {
        if (tagId !== null) {
          // 检查关联是否已存在
          const existingRelation = await this.db.get(
            'SELECT id FROM memo_tags WHERE memoId = ? AND tagId = ?',
            [memoId, tagId]
          );

          if (!existingRelation) {
            await this.db.run(
              `INSERT INTO memo_tags (memoId, tagId, createdAt) VALUES (?, ?, ?)`,
              [memoId, tagId, new Date().toISOString()]
            );
          }
        }
      }
    }
  }

  async updateMemo(id: number, updateMemoDto: UpdateMemoDto): Promise<Memo> {
    const currentMemo = await this.getMemo(id);
    if (!currentMemo) {
      throw new Error('备忘录不存在');
    }

    const { data } = updateMemoDto;
    let sql: string;
    let params: any[];
    let newContent = '';

    if (currentMemo.type === MemoType.NOTE) {
      const noteContent = 'noteContent' in data ? data.noteContent : currentMemo.noteContent;
      sql = 'UPDATE memos SET noteContent = ? WHERE id = ?';
      params = [noteContent, id];
      newContent = noteContent || '';
    } else {
      const bookmarkDescription = 'bookmarkDescription' in data ? data.bookmarkDescription : currentMemo.bookmarkDescription;
      sql = 'UPDATE memos SET bookmarkTitle = ?, bookmarkUrl = ?, bookmarkDescription = ?, bookmarkIcon = ? WHERE id = ?';
      params = [
        'bookmarkTitle' in data ? data.bookmarkTitle : currentMemo.bookmarkTitle,
        'bookmarkUrl' in data ? data.bookmarkUrl : currentMemo.bookmarkUrl,
        bookmarkDescription,
        'bookmarkIcon' in data ? data.bookmarkIcon : currentMemo.bookmarkIcon,
        id
      ];
      newContent = bookmarkDescription || '';
    }

    await this.db.run(sql, params);

    // 获取当前备忘录关联的标签
    const currentTags = await this.getMemoTags(id);

    // 删除现有的标签关联
    await this.db.run('DELETE FROM memo_tags WHERE memoId = ?', [id]);

    // 提取并保存新标签
    await this.extractAndSaveTags(newContent, id);

    return this.getMemo(id);
  }

  // 获取备忘录关联的标签
  private async getMemoTags(memoId: number): Promise<{ id: number, path: string }[]> {
    const sql = `
      SELECT t.id, t.path
      FROM tags t
      JOIN memo_tags mt ON t.id = mt.tagId
      WHERE mt.memoId = ?
    `;
    return this.db.all(sql, [memoId]);
  }

  async deleteMemo(id: number): Promise<void> {
    // 先删除标签关联
    await this.db.run('DELETE FROM memo_tags WHERE memoId = ?', [id]);

    // 再删除备忘录本身
    await this.db.run('DELETE FROM memos WHERE id = ?', [id]);
  }

  async searchMemos(query: string): Promise<Memo[]> {
    const sql = `SELECT * FROM memos WHERE
      noteContent LIKE ? OR
      bookmarkTitle LIKE ? OR
      bookmarkUrl LIKE ? OR
      bookmarkDescription LIKE ?`;

    const searchParam = `%${query}%`;
    const params = [searchParam, searchParam, searchParam, searchParam];
    return this.db.all<Memo>(sql, params);
  }

  async getMemosByType(type: MemoType): Promise<Memo[]> {
    const sql = 'SELECT * FROM memos WHERE type = ?';
    return this.db.all<Memo>(sql, [type]);
  }

  // 在类的末尾添加以下方法
  async getTags(): Promise<TagTreeNode[]> {
    // 获取所有标签及其关联的备忘录数量
    const sql = `
      SELECT t.id, t.path, t.parentId, COUNT(DISTINCT mt.memoId) as memoCount
      FROM tags t
      LEFT JOIN memo_tags mt ON t.id = mt.tagId
      GROUP BY t.id, t.path, t.parentId
      ORDER BY t.path
    `;

    const tags = await this.db.all<{
      id: number;
      path: string;
      parentId: number | null;
      memoCount: number;
    }>(sql);

    // 构建标签树
    const tagMap = new Map<number, TagTreeNode>();
    const rootNodes: TagTreeNode[] = [];

    // 首先创建所有节点
    tags.forEach(tag => {
      const pathParts = tag.path.split('/');
      const name = pathParts[pathParts.length - 1];

      const node: TagTreeNode = {
        id: tag.id,
        path: tag.path,
        name,
        children: [],
        memoCount: tag.memoCount
      };

      tagMap.set(tag.id, node);

      if (tag.parentId === null) {
        rootNodes.push(node);
      }
    });

    // 建立父子关系
    tags.forEach(tag => {
      if (tag.parentId !== null) {
        const parentNode = tagMap.get(tag.parentId);
        const currentNode = tagMap.get(tag.id);
        if (parentNode && currentNode) {
          parentNode.children.push(currentNode);
        }
      }
    });

    return rootNodes;
  }
}