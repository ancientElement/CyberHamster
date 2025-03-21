// 数据库配置常量
export const DATABASE_CONFIG = {
  // SQLite数据库文件路径
  DB_PATH: './data/cyberhamster.db',
  // 数据库版本
  VERSION: '1.0.0',
};

// 数据库表名常量
export const DATABASE_TABLES = {
  MEMOS: 'memos',
  NOTES: 'notes',
  BOOKMARKS: 'bookmarks',
  TAGS: 'tags',
  MEMO_TAGS: 'memo_tags',
};

// 数据库表结构SQL语句
export const TABLE_SCHEMAS = {
  // 备忘录表
  MEMOS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.MEMOS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type INTEGER NOT NULL,
      relativeID INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    )
  `,

  // 笔记表
  NOTES: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.NOTES} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `,

  // 书签表
  BOOKMARKS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.BOOKMARKS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      createdAt TEXT NOT NULL
    )
  `,

  // 标签表
  TAGS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.TAGS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      parentId INTEGER,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (parentId) REFERENCES ${DATABASE_TABLES.TAGS} (id)
    )
  `,

  // 备忘录标签关联表
  MEMO_TAGS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.MEMO_TAGS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memoId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (memoId) REFERENCES ${DATABASE_TABLES.MEMOS} (id),
      FOREIGN KEY (tagId) REFERENCES ${DATABASE_TABLES.TAGS} (id)
    )
  `,
};