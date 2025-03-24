import { CreateMemoDto, UpdateMemoDto, Memo, MemoType } from './types';
import { DatabaseAdaptor } from 'src/client-server-public/database-adaptor';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export class MemoApiServiceAdaptor {
  private db: DatabaseAdaptor

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

  private async getWebPageInfo(url: string) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      return {
        title: $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') || '',
        icon: $('link[rel="icon"]').attr('href') ||
          $('link[rel="shortcut icon"]').attr('href') || null
      };
    } catch (error) {
      console.error('获取网页信息失败:', error);
      return { title: '', description: '', icon: null };
    }
  }

  async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
    const { data } = createMemoDto;
    const createdAt = new Date().toISOString();

    let sql: string;
    let params: any[];

    if (data.type === MemoType.NOTE) {
      sql = 'INSERT INTO memos (type, createdAt, noteContent) VALUES (?, ?, ?)';
      params = [data.type, createdAt, data.noteContent];
    } else {
      if (!data.bookmarkUrl?.trim()) {
        throw new Error('URL不能为空');
      }

      const url = data.bookmarkUrl.trim();
      const webInfo = await this.getWebPageInfo(url);

      sql = 'INSERT INTO memos (type, createdAt, bookmarkTitle, bookmarkUrl, bookmarkDescription, bookmarkIcon) VALUES (?, ?, ?, ?, ?, ?)';
      params = [
        data.type,
        createdAt,
        data.bookmarkTitle?.trim() || webInfo.title || null,
        url,
        data.bookmarkDescription?.trim() || webInfo.description || null,
        data.bookmarkIcon || webInfo.icon || null
      ];
    }

    const runResult = await this.db.run(sql, params);
    return this.getMemo(runResult.lastID);
  }

  async updateMemo(id: number, updateMemoDto: UpdateMemoDto): Promise<Memo> {
    const currentMemo = await this.getMemo(id);
    if (!currentMemo) {
      throw new Error('备忘录不存在');
    }

    const { data } = updateMemoDto;
    let sql: string;
    let params: any[];

    if (currentMemo.type === MemoType.NOTE) {
      sql = 'UPDATE memos SET noteContent = ? WHERE id = ?';
      params = ['noteContent' in data ? data.noteContent : currentMemo.noteContent, id];
    } else {
      sql = 'UPDATE memos SET bookmarkTitle = ?, bookmarkUrl = ?, bookmarkDescription = ?, bookmarkIcon = ? WHERE id = ?';
      params = [
        'bookmarkTitle' in data ? data.bookmarkTitle : currentMemo.bookmarkTitle,
        'bookmarkUrl' in data ? data.bookmarkUrl : currentMemo.bookmarkUrl,
        'bookmarkDescription' in data ? data.bookmarkDescription : currentMemo.bookmarkDescription,
        'bookmarkIcon' in data ? data.bookmarkIcon : currentMemo.bookmarkIcon,
        id
      ];
    }

    await this.db.run(sql, params);
    return this.getMemo(id);
  }

  async deleteMemo(id: number): Promise<void> {
    const sql = 'DELETE FROM memos WHERE id = ?';
    await this.db.run(sql, [id]);
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
}