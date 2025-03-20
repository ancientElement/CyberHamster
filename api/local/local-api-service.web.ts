import { IApiService } from "../i-api-service";
import { ApiResponse, Memo, CreateMemoRequest, MemoType, Tag, CreateTagRequest, Note, Bookmark } from "../types";
import * as initSqlJs from 'sql.js';

export class LocalApiService extends IApiService {

  private convertToNote(row: any[]): Note {
    const [noteId, content, noteCreatedAt] = row;
    return {
      id: Number(noteId),
      content: String(content),
      createdAt: String(noteCreatedAt)
    };
  }

  private convertToBookmark(row: any[]): Bookmark {
    const [bookmarkId, title, url, description, icon, bookmarkCreatedAt] = row;
    return {
      id: Number(bookmarkId),
      title: String(title),
      url: String(url),
      description: String(description),
      icon: String(icon),
      createdAt: String(bookmarkCreatedAt)
    };
  }

  private convertToMemo(row: any[], data: Note | Bookmark): Memo {
    const [id, type, relativeID, createdAt] = row;
    return {
      id: Number(id),
      type: Number(type),
      relativeID: Number(relativeID),
      data,
      createdAt: String(createdAt)
    };
  }

  private convertToTag(row: any[]): Tag {
    const [id, path, parentId, createdAt] = row;
    return {
      id: Number(id),
      path: String(path),
      parentId: parentId ? Number(parentId) : undefined,
      createdAt: String(createdAt)
    };
  }

  private db: initSqlJs.Database | null = null;

  constructor() {
    super();
    this.initDatabase();
  }

  private async initDatabase() {
    const SQL = await initSqlJs({
      locateFile: (file: string) => 'F:\\WorkPlace\\CURSOR\\ProjectHumster_3\\testdb\\mydatabase.db'
    });

    this.db = new SQL.Database();

    // 创建memos表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type INTEGER NOT NULL,
        relativeID INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // 创建notes表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // 创建bookmarks表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    // 创建tags表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        parentId INTEGER,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (parentId) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    // 创建memo_tags关联表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memo_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memoId INTEGER NOT NULL,
        tagId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (memoId) REFERENCES memos(id) ON DELETE CASCADE,
        FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    // 创建索引
    this.db.run('CREATE INDEX IF NOT EXISTS idx_memos_type ON memos(type);');
    this.db.run('CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(path);');
    this.db.run('CREATE INDEX IF NOT EXISTS idx_memo_tags_memo ON memo_tags(memoId);');
    this.db.run('CREATE INDEX IF NOT EXISTS idx_memo_tags_tag ON memo_tags(tagId);');
  }

  async getMemos(): Promise<ApiResponse<Memo[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memos: Memo[] = [];
      const result = this.db.exec('SELECT * FROM memos ORDER BY createdAt DESC');

      for (const row of result[0]?.values || []) {
        const [id, type, relativeID, createdAt] = row;
        let data;

        if (type === MemoType.NOTE) {
          const noteResult = this.db.exec(`SELECT * FROM notes WHERE id = ${relativeID}`);
          data = this.convertToNote(noteResult[0]?.values[0] || []);
        } else {
          const bookmarkResult = this.db.exec(`SELECT * FROM bookmarks WHERE id = ${relativeID}`);
          data = this.convertToBookmark(bookmarkResult[0]?.values[0] || []);
        }

        // 将 SQL 值转换为字符串,避免 null 值
        memos.push(this.convertToMemo([id, type, relativeID, createdAt], data));
      }

      return { status: 200, data: memos };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getMemo(id: string): Promise<ApiResponse<Memo>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const result = this.db.exec(`SELECT * FROM memos WHERE id = ${id}`);
      if (!result[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const [memoId, type, relativeID, createdAt] = result[0].values[0];
      let data;

      if (type === MemoType.NOTE) {
        const noteResult = this.db.exec(`SELECT * FROM notes WHERE id = ${relativeID}`);
        data = this.convertToNote(noteResult[0]?.values[0] || []);
      } else {
        const bookmarkResult = this.db.exec(`SELECT * FROM bookmarks WHERE id = ${relativeID}`);
        data = this.convertToBookmark(bookmarkResult[0]?.values[0] || []);
      }

      return {
        status: 200,
        data: this.convertToMemo([memoId, type, relativeID, createdAt], data)
      };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async createMemo(data: CreateMemoRequest): Promise<ApiResponse<Memo>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const createdAt = new Date().toISOString();
      let relativeID;

      if (data.type === MemoType.NOTE) {
        const note = data.data as Note;
        this.db.run('INSERT INTO notes (content, createdAt) VALUES (?, ?)', [note.content, createdAt]);
        const noteResult = this.db.exec('SELECT last_insert_rowid() as id');
        relativeID = noteResult[0].values[0][0];
      } else {
        const bookmark = data.data as Bookmark;
        this.db.run(
          'INSERT INTO bookmarks (title, url, description, icon, createdAt) VALUES (?, ?, ?, ?, ?)',
          [bookmark.title, bookmark.url, bookmark.description, bookmark.icon, createdAt]
        );
        const bookmarkResult = this.db.exec('SELECT last_insert_rowid() as id');
        relativeID = bookmarkResult[0].values[0][0];
      }

      this.db.run(
        'INSERT INTO memos (type, relativeID, createdAt) VALUES (?, ?, ?)',
        [data.type, relativeID, createdAt]
      );

      const memoResult = this.db.exec('SELECT last_insert_rowid() as id');

      return {
        status: 200,
        data: this.convertToMemo(memoResult[0].values[0], data.data)
      };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async updateMemo(id: string, data: Partial<CreateMemoRequest>): Promise<ApiResponse<Memo>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memoResult = this.db.exec(`SELECT * FROM memos WHERE id = ${id}`);
      if (!memoResult[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const [memoId, type, relativeID, createdAt] = memoResult[0].values[0];

      if (data.data) {
        if (type === MemoType.NOTE) {
          const note = data.data as Note;
          this.db.run(
            `UPDATE notes SET content = ? WHERE id = ?`,
            [note.content, relativeID]
          );
        } else {
          const bookmark = data.data as Bookmark;
          this.db.run(
            `UPDATE bookmarks SET title = ?, url = ?, description = ?, icon = ? WHERE id = ?`,
            [bookmark.title, bookmark.url, bookmark.description, bookmark.icon, relativeID]
          );
        }
      }

      return await this.getMemo(id);
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async deleteMemo(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memoResult = this.db.exec(`SELECT * FROM memos WHERE id = ${id}`);
      if (!memoResult[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const [, type, relativeID] = memoResult[0].values[0];

      if (type === MemoType.NOTE) {
        this.db.run(`DELETE FROM notes WHERE id = ?`, [relativeID]);
      } else {
        this.db.run(`DELETE FROM bookmarks WHERE id = ?`, [relativeID]);
      }

      this.db.run(`DELETE FROM memos WHERE id = ?`, [id]);
      this.db.run(`DELETE FROM memo_tags WHERE memoId = ?`, [id]);

      return { status: 200 };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memos: Memo[] = [];
      const noteResults = this.db.exec(`
        SELECT m.*, n.* FROM memos m
        INNER JOIN notes n ON m.relativeID = n.id
        WHERE m.type = ${MemoType.NOTE} AND n.content LIKE '%${query}%'
      `);

      const bookmarkResults = this.db.exec(`
        SELECT m.*, b.* FROM memos m
        INNER JOIN bookmarks b ON m.relativeID = b.id
        WHERE m.type = ${MemoType.BOOKMARK}
        AND (b.title LIKE '%${query}%' OR b.description LIKE '%${query}%')
      `);

      for (const row of noteResults[0]?.values || []) {
        const [id, type, relativeID, createdAt, noteId, content, noteCreatedAt] = row;
        const noteData = this.convertToNote([noteId, content, noteCreatedAt]);
        memos.push(this.convertToMemo([id, type, relativeID, createdAt], noteData));
      }

      for (const row of bookmarkResults[0]?.values || []) {
        const [id, type, relativeID, createdAt, bookmarkId, title, url, description, icon, bookmarkCreatedAt] = row;
        const bookmarkData = this.convertToBookmark([bookmarkId, title, url, description, icon, bookmarkCreatedAt]);
        memos.push(this.convertToMemo([id, type, relativeID, createdAt], bookmarkData));
      }

      return { status: 200, data: memos };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memos: Memo[] = [];
      const result = this.db.exec(`SELECT * FROM memos WHERE type = ${type}`);

      for (const row of result[0]?.values || []) {
        const [id, memoType, relativeID, createdAt] = row;
        let data;

        if (type === MemoType.NOTE) {
          const noteResult = this.db.exec(`SELECT * FROM notes WHERE id = ${relativeID}`);
          const [noteId, content, noteCreatedAt] = noteResult[0]?.values[0] || [];
          data = this.convertToNote([noteId, content, noteCreatedAt]);
        } else {
          const bookmarkResult = this.db.exec(`SELECT * FROM bookmarks WHERE id = ${relativeID}`);
          const [bookmarkId, title, url, description, icon, bookmarkCreatedAt] = bookmarkResult[0]?.values[0] || [];
          data = this.convertToBookmark([bookmarkId, title, url, description, icon, bookmarkCreatedAt]);
        }

        memos.push(this.convertToMemo([id, memoType, relativeID, createdAt], data));
      }

      return { status: 200, data: memos };
    } catch (error) {
      return { status: 500, error: error };
    }
  }
  async getTags(): Promise<ApiResponse<Tag[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const result = this.db.exec('SELECT * FROM tags ORDER BY path');
      const tags: Tag[] = (result[0]?.values || []).map((row) => this.convertToTag(row));

      return { status: 200, data: tags };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getTag(id: string): Promise<ApiResponse<Tag>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const result = this.db.exec(`SELECT * FROM tags WHERE id = ${id}`);
      if (!result[0]?.values.length) {
        return { status: 404, message: 'Tag not found' };
      }

      return {
        status: 200,
        data: this.convertToTag(result[0].values[0])
      };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const createdAt = new Date().toISOString();
      this.db.run(
        'INSERT INTO tags (path, parentId, createdAt) VALUES (?, ?, ?)',
        [data.path, data.parentId || null, createdAt]
      );

      const result = this.db.exec('SELECT last_insert_rowid() as id');

      return { status: 200, data: this.convertToTag(result[0].values[0]) };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async updateTag(id: string, data: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const tagResult = this.db.exec(`SELECT * FROM tags WHERE id = ${id}`);
      if (!tagResult[0]?.values.length) {
        return { status: 404, message: 'Tag not found' };
      }

      if (data.path) {
        this.db.run('UPDATE tags SET path = ? WHERE id = ?', [data.path, id]);
      }
      if (data.parentId !== undefined) {
        this.db.run('UPDATE tags SET parentId = ? WHERE id = ?', [data.parentId, id]);
      }

      return await this.getTag(id);
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const tagResult = this.db.exec(`SELECT * FROM tags WHERE id = ${id}`);
      if (!tagResult[0]?.values.length) {
        return { status: 404, message: 'Tag not found' };
      }

      this.db.run('DELETE FROM tags WHERE id = ?', [id]);
      this.db.run('DELETE FROM memo_tags WHERE tagId = ?', [id]);

      return { status: 200 };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getChildTags(id: string): Promise<ApiResponse<Tag[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const result = this.db.exec(`SELECT * FROM tags WHERE parentId = ${id}`);
      const tags: Tag[] = (result[0]?.values || []).map(row => this.convertToTag(row));

      return { status: 200, data: tags };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getTagMemos(id: string): Promise<ApiResponse<Tag[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const result = this.db.exec(`
  SELECT t.* FROM tags t
  INNER JOIN memo_tags mt ON t.id = mt.tagId
  WHERE mt.memoId = ${id}
`);

      const tags: Tag[] = (result[0]?.values || []).map(row => this.convertToTag(row));

      return { status: 200, data: tags };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async addTagToMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memoResult = this.db.exec(`SELECT * FROM memos WHERE id = ${memoId}`);
      if (!memoResult[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const tagResult = this.db.exec(`SELECT * FROM tags WHERE id = ${tagId}`);
      if (!tagResult[0]?.values.length) {
        return { status: 404, message: 'Tag not found' };
      }

      const existingResult = this.db.exec(
        `SELECT * FROM memo_tags WHERE memoId = ${memoId} AND tagId = ${tagId}`
      );
      if (existingResult[0]?.values.length) {
        return { status: 400, message: 'Tag already added to memo' };
      }

      const createdAt = new Date().toISOString();
      this.db.run(
        'INSERT INTO memo_tags (memoId, tagId, createdAt) VALUES (?, ?, ?)',
        [memoId, tagId, createdAt]
      );

      return { status: 200 };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async removeTagFromMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memoResult = this.db.exec(`SELECT * FROM memos WHERE id = ${memoId}`);
      if (!memoResult[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const tagResult = this.db.exec(`SELECT * FROM tags WHERE id = ${tagId}`);
      if (!tagResult[0]?.values.length) {
        return { status: 404, message: 'Tag not found' };
      }

      this.db.run(
        'DELETE FROM memo_tags WHERE memoId = ? AND tagId = ?',
        [memoId, tagId]
      );

      return { status: 200 };
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async getMemoTags(memoId: string): Promise<ApiResponse<Tag[]>> {
    try {
      if (!this.db) throw new Error('Database not initialized');

      const memoResult = this.db.exec(`SELECT * FROM memos WHERE id = ${memoId}`);
      if (!memoResult[0]?.values.length) {
        return { status: 404, message: 'Memo not found' };
      }

      const result = this.db.exec(`
        SELECT t.* FROM tags t
        INNER JOIN memo_tags mt ON t.id = mt.tagId
        WHERE mt.memoId = ${memoId}
      `);

      const tags: Tag[] = (result[0]?.values || []).map(row => this.convertToTag(row));

      return { status: 200, data: tags };
    } catch (error) {
      return { status: 500, error: error };
    }
  }
}