import { Database, RunResult } from "sqlite3";

export class DatabaseAdaptor {
  private db: Database;

  constructor(filename: string, callback?: (err: Error | null) => void) {
    this.db = new Database(filename,callback);
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