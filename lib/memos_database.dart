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
  List<String>? images;
  MemoEditorData editorData = MemoEditorData();

  // 私有构造函数
  Memo._internal({
    required this.id,
    required this.context,
    required this.creatDate,
    this.images,
  });

  initID(int id) {
    this.id = id;
  }

  void addImages(String image) {
    images?.add(image);
  }

  // 工厂构造函数，确保只能通过 MemoDatabase 创建 Memo 对象
  factory Memo.fromDatabase({
    required int id,
    required String context,
    required int creatDate,
    List<String>? images,
  }) {
    return Memo._internal(
      id: id,
      context: context,
      creatDate: creatDate,
      images: images,
    );
  }

  // 将 Memo 对象转换为 Map
  Map<String, dynamic> toMap() {
    return {'ID': id, 'CONTEXT': context, 'CREATDATE': creatDate};
  }

  // 从 Map 中创建 Memo 对象
  factory Memo.fromMap(Map<String, dynamic> map, List<String>? images) {
    return Memo._internal(
      id: map['ID'],
      context: map['CONTEXT'],
      creatDate: map['CREATDATE'],
      images: images,
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
      onCreate: (db, version) async {
        await db.execute(
          'CREATE TABLE MEMOS ('
          'ID        INTEGER  PRIMARY KEY ASC AUTOINCREMENT,'
          'CONTEXT   TEXT,'
          'CREATDATE DATETIME'
          ');',
        );
        await db.execute(
          'CREATE TABLE MEMO_IMAGES ('
          'ID         INTEGER PRIMARY KEY AUTOINCREMENT,'
          'MEMO_ID    INTEGER REFERENCES MEMOS (ID),'
          'IMAGE_NAME TEXT'
          ');',
        );
      },
    );
  }

  // 插入一条记录
  Future<Memo> create(String context, List<String>? images) async {
    final db = await instance.database;
    final creatDate = DateTime.now().millisecondsSinceEpoch;
    Map<String, dynamic> map = {'CONTEXT': context, 'CREATDATE': creatDate};
    final id = await db.insert('MEMOS', map);
    final memo = Memo.fromDatabase(
      id: id,
      context: context,
      creatDate: creatDate,
      images: images,
    );
    memo.initID(id);
    if (images != null) {
      for (final name in images) {
        await db.insert('MEMO_IMAGES', {'MEMO_ID': id, 'IMAGE_NAME': name});
      }
    }
    return memo;
  }

  // 查询所有记录
  Future<List<Memo>> readAllMemos() async {
    final db = await instance.database;
    final memos = await db.query('MEMOS', orderBy: 'CREATDATE DESC');

    List<Memo> memoList = [];
    for (final memoMap in memos) {
      // 查询对应的图片
      final images = await db.query(
        'MEMO_IMAGES',
        where: 'MEMO_ID = ?',
        whereArgs: [memoMap['ID']],
      );

      final memoImages =
          images.map((img) => img['IMAGE_NAME'] as String).toList();
      memoList.add(Memo.fromMap(memoMap, memoImages));
    }
    return memoList;
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
      final images = await db.query(
        'MEMO_IMAGES',
        where: 'MEMO_ID = ?',
        whereArgs: [id],
      );
      final memoImages =
          images.map((img) => img['IMAGE_NAME'] as String).toList();
      return Memo.fromMap(maps.first, memoImages);
    } else {
      return null;
    }
  }

  // 更新记录
  Future<void> updateContext(int id, String context) async {
    final db = await instance.database;
    await db.update(
      'MEMOS',
      {"CONTEXT": context},
      where: 'ID = ?',
      whereArgs: [id],
    );
    return;
  }

  Future<void> updateImages(int id, List<String> images) async {
    final db = await instance.database;
    for (final name in images) {
      await db.insert('MEMO_IMAGES', {'MEMO_ID': id, 'IMAGE_NAME': name});
    }
    return;
  }

  // 删除记录
  Future<int> delete(int id) async {
    final db = await instance.database;
    await db.delete('MEMO_IMAGES', where: 'MEMO_ID = ?', whereArgs: [id]);
    return await db.delete('MEMOS', where: 'ID = ?', whereArgs: [id]);
  }

  // 关闭数据库
  Future close() async {
    final db = await instance.database;
    db.close();
  }
}
