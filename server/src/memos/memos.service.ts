import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMemoDto, UpdateMemoDto, Memo, MemoType } from '../types';

@Injectable()
export class MemosService {
  constructor(private readonly databaseService: DatabaseService) { }

  async getMemos(): Promise<Memo[]> {
    const sql = 'SELECT * FROM memos';
    const Memos = [];
    return await new Promise<Memo[]>((resolve, reject) => {
      this.databaseService.getDatabase().each<Memo>(sql, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getMemo(id: number): Promise<Memo> {
    const sql = 'SELECT * FROM memos WHERE id = ?';
    return await new Promise<Memo>((resolve, reject) => {
      this.databaseService.getDatabase().get<Memo>(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async createMemo(createMemoDto: CreateMemoDto): Promise<Memo> {
    const { type, data } = createMemoDto;
    const sql = 'INSERT INTO memos (type, data, createdAt) VALUES (?, ?, ?)';
    const createdAt = new Date().toISOString();

    return await new Promise<Memo>((resolve, reject) => {
      this.databaseService.getDatabase().run(
        sql,
        [type, JSON.stringify(data), createdAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              type,
              relativeID: 0,
              data,
              createdAt
            });
          }
        }
      );
    });
  }

  async updateMemo(id: number, updateMemoDto: UpdateMemoDto): Promise<Memo> {
    const { type, data } = updateMemoDto;
    const sql = 'UPDATE memos SET type = ?, data = ? WHERE id = ?';

    return await new Promise<Memo>((resolve, reject) => {
      this.databaseService.getDatabase().run(
        sql,
        [type, JSON.stringify(data), id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            this.getMemo(id).then(resolve).catch(reject);
          }
        }
      );
    });
  }

  async deleteMemo(id: number): Promise<void> {
    const sql = 'DELETE FROM memos WHERE id = ?';

    return await new Promise<void>((resolve, reject) => {
      this.databaseService.getDatabase().run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async searchMemos(query: string): Promise<Memo[]> {
    const sql = "SELECT * FROM memos WHERE json_extract(data, '$.content') LIKE ? OR json_extract(data, '$.title') LIKE ?";
    const searchPattern = `%${query}%`;

    return await new Promise<Memo[]>((resolve, reject) => {
      this.databaseService.getDatabase().all<Memo>(
        sql,
        [searchPattern, searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async getMemosByType(type: MemoType): Promise<Memo[]> {
    const sql = 'SELECT * FROM memos WHERE type = ?';

    return await new Promise<Memo[]>((resolve, reject) => {
      this.databaseService.getDatabase().all<Memo>(sql, [type], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}