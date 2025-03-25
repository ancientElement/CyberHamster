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
  TAGS: 'tags',
  MEMO_TAGS: 'memo_tags',
  USERS: 'users',
};

// 数据库表结构SQL语句
export const TABLE_SCHEMAS = {
  // 用户表
  USERS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.USERS} (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      creatAt  TEXT
    )`,

  // 备忘录表 - 使用JSON存储不同类型的备忘录数据
  MEMOS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.MEMOS} (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT
                                  NOT NULL,
      type                INTEGER NOT NULL,
      createdAt           TEXT    NOT NULL,
      noteContent         TEXT,
      bookmarkTitle       TEXT,
      bookmarkUrl         TEXT,
      bookmarkDescription TEXT,
      bookmarkIcon        TEXT
    )
  `,

  // 标签表
  TAGS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.TAGS} (
      id        INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
      path      TEXT    NOT NULL
                        UNIQUE,
      parentId  INTEGER REFERENCES ${DATABASE_TABLES.TAGS} (id),
      createdAt TEXT    NOT NULL
    )
  `,

  // 备忘录标签关联表
  MEMO_TAGS: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLES.MEMO_TAGS} (
        id        INTEGER PRIMARY KEY AUTOINCREMENT
                      NOT NULL,
        memoId    INTEGER NOT NULL
                          REFERENCES ${DATABASE_TABLES.MEMOS} (id),
        tagId     INTEGER NOT NULL
                          REFERENCES ${DATABASE_TABLES.TAGS} (id),
        createdAt TEXT    NOT NULL
    )
  `,
};