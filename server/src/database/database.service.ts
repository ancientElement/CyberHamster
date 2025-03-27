import { Injectable, OnModuleInit } from '@nestjs/common';
import { DATABASE_CONFIG, TABLE_SCHEMAS } from './schemas';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { serviceDatabaseAdaptor } from 'src/database/service-databse-adaptor';
import { ConfigService } from '@nestjs/config';
import { DB_PATH } from 'src/const';

@Injectable()
export class DatabaseService implements OnModuleInit {
  db: serviceDatabaseAdaptor;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 确保数据库目录存在
      const db_path = this.configService.get<string>(DB_PATH,'./data/cyberhamster.db');
      const dbDir = dirname(db_path);
      mkdirSync(dbDir, { recursive: true });

      this.db = new serviceDatabaseAdaptor(db_path, (err) => {
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
}