export abstract class DatabaseAdaptor {
  abstract all<T>(sql: string): Promise<T[]>;
  abstract all<T>(sql: string, params: any): Promise<T[]>;
  abstract all<T>(sql: string, ...rest: any[]): Promise<T[]>;
  abstract get<T>(sql: string, params: any): Promise<T>;
  abstract run(sql: string, params: any): Promise<any>;
}