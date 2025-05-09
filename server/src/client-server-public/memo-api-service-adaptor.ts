import { CreateMemoDto, UpdateMemoDto, Memo, MemoType, TagTreeNode, TagItem, UpdateTagDto } from './types';
import { DatabaseAdaptor } from './database-adaptor';
import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';



export class MemoApiServiceAdaptor {
  private db!: DatabaseAdaptor;
  private openai!: OpenAI;

  setDd(db: DatabaseAdaptor) {
    this.db = db;
  }

  setOpenai(openai: OpenAI) {
    this.openai = openai;
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
      data.noteContent = await this.analyzeContentWithAI(data.noteContent);
      params = [data.type, createdAt, data.noteContent];
      content = data.noteContent || '';
    } else {
      sql = 'INSERT INTO memos (type, createdAt, bookmarkTitle, bookmarkUrl, bookmarkDescription, bookmarkIcon) VALUES (?, ?, ?, ?, ?, ?)';
      data.bookmarkDescription && (data.bookmarkDescription = await this.analyzeContentWithAI(data.bookmarkDescription, data.bookmarkUrl, data.bookmarkTitle));
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

  /**
   * 使用AI分析内容并提取标签
   * @param content 内容文本
   * @param url 可选的书签URL
   * @param title 可选的书签标题
   * @returns 处理后的内容（标签+原始内容）
   */
  private async analyzeContentWithAI(content: string, url?: string, title?: string): Promise<string> {
    // 如果内容为空，直接返回
    if (!content || content.trim() === '') return content;

    // 初始化变量
    let processedContent = content;
    let contentForAnalysis = '';
    let contentType = '笔记';

    try {
      // 获取现有标签列表
      const existingTags = await this.getTags();

      // 处理书签类型内容
      if (url && title) {
        contentForAnalysis = `标题：${title}\n链接：${url}\n内容：${content}`;
        contentType = '网页信息';
      } else {
        contentForAnalysis = content;
      }

      // 构建AI请求参数
      const body: ChatCompletionCreateParamsNonStreaming = {
        model: "qwen-plus",
        temperature: 0.3, // 降低随机性，使标签更加一致
        max_tokens: 100,  // 限制输出长度，标签不需要太长
        messages: [
          {
            role: "system",
            content: `你是一个专业的内容标签提取助手，使用中文返回数据。请分析用户提供的${contentType}，生成1-5个最相关的内容标签，最好有一个最大概方向的父标签，例如#技术 #生活 #工作。
              现有标签列表：${existingTags.join(' ')}
              严格遵循以下规则：
              1. 每个标签以#开头，多个标签之间用单个空格分隔
              2. 可以使用现有标签，当现有标签与内容相似度太低请不要使用现有标签
              3. 现有标签不匹配时请创建新标签
              3. 对于层级标签，使用/分隔，如#技术/编程
              4. 标签应简洁、准确，能够反映内容的核心主题
              5. 只返回标签，不要有任何其他内容，不要使用"和"、"以及"等连接词
              6. 请尽可能少的生成标签，标签对内容描述越准确越好
              7. 内容中的标题要注意，对标题内容进行着重分析，例如标题中的平台信息
              8. 如果内容中包含平台信息，请在标签中包含该平台信息,平台信息非常重要优先于其他标签，例如#微信#公众号#文章
              输出格式示例：#标签1 #标签2 #标签3/子标签`
          },
          { role: "user", content: contentForAnalysis }
        ],
      };

      // 调用AI接口
      const completion = await this.openai.chat.completions.create(body);

      // 处理返回结果
      const suggestedTags = completion.choices[0]?.message?.content?.trim() || "";

      // 验证返回的标签格式是否正确
      if (suggestedTags) {
        const tags = suggestedTags.split(' ').filter(tag => tag.trim() !== '');
        const isValidTags = tags.every(tag => tag.startsWith('#'));

        if (isValidTags && tags.length > 0) {
          processedContent = `${suggestedTags}\n${content}`;
          console.log(`成功生成标签: ${suggestedTags}`);
        } else {
          console.warn("AI返回的标签格式不正确，每个标签必须以#号开头:", suggestedTags);
          processedContent = content; // 如果格式不正确，返回原始内容
        }
      } else {
        processedContent = content;
      }

      return processedContent;
    } catch (error) {
      // 增强错误处理
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`AI分析内容失败 [${contentType}]: ${errorMessage}`);

      // 发生错误时返回原始内容
      return content;
    }
  }

  // 提取并保存标签
  private async extractAndSaveTags(content: string, memoId: number): Promise<void> {
    // 提取以#开头的标签，支持嵌套路径格式 #tag 或 #parent/child
    const tagRegex = /#[\w\u4e00-\u9fa5\/]+/g;
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

      // 逐级创建或获取标签，例如对于1/2/3/4，依次创建1、1/2、1/2/3、1/2/3/4
      for (let i = 0; i < tagParts.length; i++) {
        const part = tagParts[i];
        // 构建当前层级的路径
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        // 检查当前路径的标签是否存在
        const existingTag = await this.db.get<{ id: number }>('SELECT id FROM tags WHERE path = ?', [currentPath]);

        let tagId: number;
        if (existingTag) {
          // 标签已存在，使用现有标签ID
          tagId = existingTag.id;
        } else {
          // 创建新标签，关联到父标签
          const tagResult = await this.db.run(
            'INSERT INTO tags (path, parentId, createdAt) VALUES (?, ?, ?)',
            [currentPath, parentId, new Date().toISOString()]
          );
          tagId = tagResult.lastID;
        }

        // 更新父标签ID为当前标签ID，用于下一级标签
        parentId = tagId;
        // 将标签ID添加到列表
        tagIds.push(tagId);
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
  async getTags(): Promise<string[]> {
    const sql = `
      SELECT path FROM tags
    `;

    const tags = await this.db.all<{ path: string }>(sql);
    return tags.map(tag => tag.path);
  }

  /**
   * 获取标签树结构
   * @returns 标签树结构
   */
  async getTagsTree(): Promise<TagTreeNode[]> {
    const sql = `
      SELECT t.id, t.path, t.parentId, t.createdAt, COUNT(mt.memoId) as number
      FROM tags t
      LEFT JOIN memo_tags mt ON t.id = mt.tagId
      GROUP BY t.id
      ORDER BY t.path
    `;

    const tags = await this.db.all<(TagItem & { number: number })>(sql);

    // 构建树结构
    const tagMap: Record<number, TagTreeNode> = {};
    const rootNodes: TagTreeNode[] = [];

    // 首先创建所有节点
    tags.forEach(tag => {
      const pathParts = tag.path.split('/');
      const name = pathParts[pathParts.length - 1];

      tagMap[tag.id] = {
        id: tag.id,
        name,
        path: tag.path,
        children: [],
        createdAt: tag.createdAt,
        number: tag.number
      };
    });

    // 然后构建树结构
    tags.forEach(tag => {
      const node = tagMap[tag.id];

      if (tag.parentId === null) {
        // 根节点
        rootNodes.push(node);
      } else if (tagMap[tag.parentId]) {
        // 添加到父节点的children中
        tagMap[tag.parentId].children.push(node);
      }
    });

    return rootNodes;
  }

  /**
   * 根据标签路径获取相关备忘录
   * @param tagPath 标签路径
   * @returns 与该标签关联的备忘录列表
   */
  async getMemosByTag(tagPath: string): Promise<Memo[]> {
    // 首先查找标签ID
    const tagSql = `SELECT id FROM tags WHERE path = ?`;
    const tag = await this.db.get<{ id: number }>(tagSql, [tagPath]);

    if (!tag) {
      return []; // 如果标签不存在，返回空数组
    }

    // 查询与该标签关联的所有备忘录
    const memosSql = `
      SELECT m.*
      FROM memos m
      JOIN memo_tags mt ON m.id = mt.memoId
      WHERE mt.tagId = ?
      ORDER BY m.createdAt DESC
    `;

    return this.db.all<Memo>(memosSql, [tag.id]);
  }

  /**
   * 根据标签ID数组获取相关备忘录
   * @param tagIds 标签ID数组
   * @returns 与这些标签关联的备忘录列表
   */
  async getMemosByTagIds(tagIds: number[]): Promise<Memo[]> {
    if (!tagIds || tagIds.length === 0) {
      return this.getMemos(); // 如果没有标签ID，返回所有备忘录
    }

    // console.log(tagIds);

    // 使用 IN 子句查询与这些标签关联的所有备忘录
    const memosSql = `
      SELECT DISTINCT m.*
      FROM memos m
      JOIN memo_tags mt ON m.id = mt.memoId
      WHERE mt.tagId IN (${tagIds.join(',')})
      ORDER BY m.createdAt DESC
    `;

    return this.db.all<Memo>(memosSql);
  }

  /**
   * 更新标签路径
   * @param id 标签ID
   * @param updateTagDto 更新标签的DTO
   * @returns 更新后的标签信息
   */
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<TagItem> {
    // 检查标签是否存在
    const existingTag = await this.db.get<TagItem>('SELECT * FROM tags WHERE id = ?', [id]);
    if (!existingTag) {
      throw new Error('标签不存在');
    }

    // 检查新路径是否已存在
    const pathExists = await this.db.get('SELECT id FROM tags WHERE path = ? AND id != ?', [updateTagDto.path, id]);
    if (pathExists) {
      throw new Error('标签路径已存在');
    }

    // 获取新路径的父标签ID
    const pathParts = updateTagDto.path.split('/');
    const parentPath = pathParts.slice(0, -1).join('/');
    let parentId: number | null = null;

    if (parentPath) {
      const parentTag = await this.db.get<{ id: number }>('SELECT id FROM tags WHERE path = ?', [parentPath]);
      if (parentTag) {
        parentId = parentTag.id;
      }
    }

    // 更新标签
    await this.db.run(
      'UPDATE tags SET path = ?, parentId = ? WHERE id = ?',
      [updateTagDto.path, parentId, id]
    );

    // 更新所有子标签的路径
    const oldPath = existingTag.path;
    const newPath = updateTagDto.path;
    await this.db.run(
      'UPDATE tags SET path = REPLACE(path, ?, ?) WHERE path LIKE ?',
      [oldPath, newPath, `${oldPath}/%`]
    );

    // 更新备忘录内容中的标签
    const oldTagPattern = `#${oldPath}`;
    const newTagPattern = `#${newPath}`;

    // 更新笔记内容中的标签
    await this.db.run(
      `UPDATE memos
       SET noteContent = REPLACE(noteContent, ?, ?)
       WHERE noteContent LIKE ?`,
      [oldTagPattern, newTagPattern, `%${oldTagPattern}%`]
    );

    // 更新书签描述中的标签
    await this.db.run(
      `UPDATE memos
       SET bookmarkDescription = REPLACE(bookmarkDescription, ?, ?)
       WHERE bookmarkDescription LIKE ?`,
      [oldTagPattern, newTagPattern, `%${oldTagPattern}%`]
    );

    // 返回更新后的标签信息
    return this.db.get<TagItem>('SELECT * FROM tags WHERE id = ?', [id]);
  }

  /**
   * 删除标签
   * @param id 标签ID
   */
  async deleteTag(id: number): Promise<void> {
    // 检查标签是否存在
    const tag = await this.db.get<TagItem>('SELECT * FROM tags WHERE id = ?', [id]);
    if (!tag) {
      throw new Error('标签不存在');
    }

    // 检查是否有子标签
    const hasChildren = await this.db.get('SELECT id FROM tags WHERE parentId = ?', [id]);
    if (hasChildren) {
      throw new Error('无法删除包含子标签的标签');
    }

    // 从备忘录内容中删除标签
    const tagPattern = `#${tag.path}`;

    // 从笔记内容中删除标签
    await this.db.run(
      `UPDATE memos
       SET noteContent = REPLACE(noteContent, ?, '')
       WHERE noteContent LIKE ?`,
      [tagPattern, `%${tagPattern}%`]
    );

    // 从书签描述中删除标签
    await this.db.run(
      `UPDATE memos
       SET bookmarkDescription = REPLACE(bookmarkDescription, ?, '')
       WHERE bookmarkDescription LIKE ?`,
      [tagPattern, `%${tagPattern}%`]
    );

    // 删除标签
    await this.db.run('DELETE FROM tags WHERE id = ?', [id]);
  }

  /**
   * 修复所有标签的格式，确保标签前有#号
   */
  async fixTagFormat(): Promise<void> {
    try {
      // 获取所有标签
      const tags = await this.getTags();

      for (const tagPath of tags) {
        // 获取标签ID
        const tag = await this.db.get<{ id: number }>('SELECT id FROM tags WHERE path = ?', [tagPath]);
        if (!tag) continue;

        // 获取与该标签关联的所有备忘录
        const memos = await this.db.all<{ id: number, noteContent: string | null, bookmarkDescription: string | null }>(
          `SELECT m.id, m.noteContent, m.bookmarkDescription
           FROM memos m
           JOIN memo_tags mt ON m.id = mt.memoId
           WHERE mt.tagId = ?`,
          [tag.id]
        );

        const tagPattern = tagPath;
        const tagWithHash = `#${tagPath}`;

        // 更新每个关联的备忘录
        for (const memo of memos) {
          if (memo.noteContent && memo.noteContent.includes(tagPattern) && !memo.noteContent.includes(tagWithHash)) {
            await this.db.run(
              `UPDATE memos
               SET noteContent = REPLACE(noteContent, ?, ?)
               WHERE id = ?`,
              [tagPattern, tagWithHash, memo.id]
            );
          }

          if (memo.bookmarkDescription && memo.bookmarkDescription.includes(tagPattern) && !memo.bookmarkDescription.includes(tagWithHash)) {
            await this.db.run(
              `UPDATE memos
               SET bookmarkDescription = REPLACE(bookmarkDescription, ?, ?)
               WHERE id = ?`,
              [tagPattern, tagWithHash, memo.id]
            );
          }
        }
      }
    } catch (error) {
      console.error('修复标签格式时发生错误:', error);
      throw error;
    }
  }

  /**
   * 通过tagPath查询tag
   * @param tagPath tag的路径，例如 "工作/项目/前端"
   * @returns 找到的tag对象，如果未找到则返回undefined
   */
  async findTagByPath(tagPath: string): Promise<TagItem | undefined> {
    if (!tagPath) return undefined;

    const sql = 'SELECT * FROM tags WHERE path = ?';
    return this.db.get<TagItem>(sql, [tagPath]);
  }

  /**
   * 删除所有没有关联备忘录的标签
   */
  async deleteEmptyTags(): Promise<void> {
    try {
      // 删除所有没有关联备忘录的标签
      await this.db.run(
        `DELETE FROM tags
         WHERE id NOT IN (
           SELECT DISTINCT tagId
           FROM memo_tags
         )`,undefined
      );
    } catch (error) {
      console.error('删除空标签时发生错误:', error);
      throw error;
    }
  }
}