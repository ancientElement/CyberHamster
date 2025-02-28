import 'dart:async';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class MemoEditorData {
  // eidtor data 编辑器数据
  bool canEdit = false;
}

class Memo {
  int id;
  String context;
  int creatDate;
  MemoEditorData editorData = MemoEditorData();

  // 私有构造函数
  Memo._internal({
    required this.id,
    required this.context,
    required this.creatDate,
  });

  initID(int id) {
    this.id = id;
  }

  // 工厂构造函数，确保只能通过 MemoDatabase 创建 Memo 对象
  factory Memo.fromDatabase({
    required int id,
    required String context,
    required int creatDate,
  }) {
    return Memo._internal(id: id, context: context, creatDate: creatDate);
  }

  // 将 Memo 对象转换为 Map
  Map<String, dynamic> toMap() {
    return {'ID': id, 'CONTEXT': context, 'CREATDATE': creatDate};
  }

  // 从 Map 中创建 Memo 对象
  factory Memo.fromMap(Map<String, dynamic> map) {
    return Memo._internal(
      id: map['ID'],
      context: map['CONTEXT'],
      creatDate: map['CREATDATE'],
    );
  }

  @override
  String toString() {
    return 'Memo{ID: $id, CONTEXT: $context, CREATDATE: $creatDate}';
  }
}

// const String devDataBasePath =
//     'F:/WorkPlace/Flutter/test_build/db/test_build.db';

class MemoDatabase {
  static final MemoDatabase instance = MemoDatabase._internal();
  static Database? _database;

  MemoDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('test_build.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final String path;
    // if (kReleaseMode) {
    final dbPath = await getDatabasesPath();
    path = join(dbPath, filePath);
    print(path);
    // } else {
    //   path = devDataBasePath;
    // }

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE MEMOS ('
          'ID        INTEGER  PRIMARY KEY ASC AUTOINCREMENT,'
          'CONTEXT   TEXT,'
          'CREATDATE DATETIME'
          ');',
        );
      },
    );
  }

  // 插入一条记录
  Future<Memo> create(String context) async {
    final db = await instance.database;
    final creatDate = DateTime.now().millisecondsSinceEpoch;
    Map<String, dynamic> map = {'CONTEXT': context, 'CREATDATE': creatDate};
    final id = await db.insert('MEMOS', map);
    final memo = Memo.fromDatabase(
      id: id,
      context: context,
      creatDate: creatDate,
    );
    memo.initID(id);
    return memo;
  }

  // 查询所有记录
  Future<List<Memo>> readAllMemos() async {
    final db = await instance.database;
    final result = await db.query(
      'MEMOS',
      orderBy: 'CREATDATE DESC', // 按照 CREATDATE 降序排列
    );
    return result.map((json) => Memo.fromMap(json)).toList();
  }

  // 根据 ID 查询单条记录
  Future<Memo?> readMemo(int id) async {
    final db = await instance.database;
    final maps = await db.query(
      'MEMOS',
      columns: ['ID', 'CONTEXT'],
      where: 'ID = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return Memo.fromMap(maps.first);
    } else {
      return null;
    }
  }

  // 更新记录
  Future<int> update(int id, String context) async {
    final db = await instance.database;
    return db.update(
      'MEMOS',
      {"CONTEXT": context},
      where: 'ID = ?',
      whereArgs: [id],
    );
  }

  // 删除记录
  Future<int> delete(int id) async {
    final db = await instance.database;
    return await db.delete('MEMOS', where: 'ID = ?', whereArgs: [id]);
  }

  // 关闭数据库
  Future close() async {
    final db = await instance.database;
    db.close();
  }
}
