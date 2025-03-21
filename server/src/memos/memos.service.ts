import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMemoDto, UpdateMemoDto, Memo, MemoType } from '../types';

@Injectable()
export class MemosService {
  constructor(private readonly databaseService: DatabaseService) { }

  async getMemos(): Promise<Memo[]> {
    const sql = 'SELECT * FROM memos';
    return await new Promise<Memo[]>((resolve, reject) => {
      this.databaseService.getDatabase().all<Memo>(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
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
    throw new Error('Method not implemented.');
  }

  async updateMemo(id: number, updateMemoDto: UpdateMemoDto): Promise<Memo> {
    throw new Error('Method not implemented.');
  }

  async deleteMemo(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async searchMemos(query: string): Promise<Memo[]> {
    throw new Error('Method not implemented.');
  }

  async getMemosByType(type: MemoType): Promise<Memo[]> {
    throw new Error('Method not implemented.');
  }
}