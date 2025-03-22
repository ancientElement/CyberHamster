import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database, RunResult } from 'sqlite3';
import { DATABASE_CONFIG, TABLE_SCHEMAS } from './schemas';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 确保数据库目录存在
      const dbDir = dirname(DATABASE_CONFIG.DB_PATH);
      mkdirSync(dbDir, { recursive: true });

      this.db = new Database(DATABASE_CONFIG.DB_PATH, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // 创建所有表
        Object.values(TABLE_SCHEMAS).forEach((schema) => {
          this.db.run(schema, (err) => {
            if (err) {
              reject(err);
              return;
            }
          });
        });

        resolve();
      });
    });
  }

  public all<T>(sql: string): Promise<T[]>;
  public all<T>(sql: string, params: any): Promise<T[]>;
  public all<T>(sql: string, ...rest: any[]): Promise<T[]> {
    const [params] = rest;
    return new Promise((resolve, reject) => {
      if (!params) {
        this.db.all<T>(sql, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        this.db.all<T>(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  }


  public async get<T>(sql: string, params: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get<T>(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public run(sql: string, params: any): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
}