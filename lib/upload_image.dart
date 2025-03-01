import 'dart:io';
import 'package:intl/intl.dart';
import 'package:path/path.dart' as path;
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

late Directory sysAppDocDir;

bool _isInitSysAppDocDir = false;

Future<void> initSysAppDocDir() async {
  if (_isInitSysAppDocDir) {
    return;
  }
  sysAppDocDir = await getSysAppDocDir();
  return;
}

Future<Directory> getSysAppDocDir() async {
  final String defualtDir = "F:/WorkPlace/Flutter/test_build/test_build/assets";
  Directory appDocDir;
  if (Platform.isIOS || Platform.isAndroid) {
    appDocDir = await getApplicationDocumentsDirectory();
  } else {
    appDocDir = Directory(defualtDir);
  }
  _isInitSysAppDocDir = true;
  return appDocDir;
}

Future<List<String>?> upLoadImage() async {
  try {
    List<String>? fileNames = [];
    // 1. 选取文件
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.image,
      allowCompression: false,
      allowMultiple: true,
    );

    if (result == null || result.files.isEmpty) return null;

    // 2. 获取文件信息
    final platformFiles = result.files;

    int i = 0;
    for (final platformFile in platformFiles) {
      if (platformFile.path == null) continue;

      // 3. 生成新文件名
      final timestamp = DateFormat('yyyyMMdd_HHmmss_$i').format(DateTime.now());
      final extension = path.extension(platformFile.path!);
      final newFileName = '$timestamp$extension';

      // 4. 获取应用文档目录并创建目标文件夹
      final Directory appDocDir = sysAppDocDir;

      final targetDir = Directory(path.join(appDocDir.path, 'images'));

      if (!await targetDir.exists()) {
        await targetDir.create(recursive: true);
      }

      // 5. 构建目标路径
      final newPath = path.join(targetDir.path, newFileName);

      // 6. 复制文件
      final originalFile = File(platformFile.path!);
      await originalFile.copy(newPath);
      i++;
      fileNames.add(newFileName);
    }

    return fileNames;
  } catch (e) {
    print('file save field 文件保存失败: $e');
    return null;
  }
}
