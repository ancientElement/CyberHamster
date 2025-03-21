import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'sqlite3';
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

  public getDatabase(): Database {
    return this.db;
  }
}