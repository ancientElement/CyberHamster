import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:project_hamster/home.dart';
import 'package:sidebarx/sidebarx.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'package:project_hamster/upload_image.dart';

void main() {
  try {
    if (Platform.isWindows || Platform.isLinux) {
      // Windows or Linux Windows 或 Linux 平台
      // set ffi  设置数据库工厂为 FFI 实现
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
    }
  } catch (e) {
    print("not windows or linux 非windows或linux平台 error:$e");
    if (kIsWeb) {
      //databse adaptor 数据库适配
      // Web platform Web 平台
      databaseFactory = databaseFactoryFfiWeb;
    }
  }
  runApp(SidebarXExampleApp());
  // init doc dir 初始化文档文件夹
  initSysAppDocDir();
}

class CHContainer {
  final Widget widget;
  final SidebarXItem item;
  CHContainer({required this.widget, required this.item});
}

class SidebarXExampleApp extends StatelessWidget {
  SidebarXExampleApp({super.key});

  final _controller = SidebarXController(selectedIndex: 0, extended: true);
  final _key = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    //register pages 注册页面
    final List<CHContainer> widgets = [
      CHContainer(
        widget: const Home(),
        item: SidebarXItem(
          icon: Icons.home,
          label: 'Home',
          onTap: () {
            debugPrint('Home');
          },
        ),
      ),
      CHContainer(
        widget: const Placeholder(),
        item: const SidebarXItem(icon: Icons.interests, label: 'Nav'),
      ),
      CHContainer(
        widget: const Placeholder(),
        item: const SidebarXItem(icon: Icons.search, label: 'Search'),
      ),
      CHContainer(
        widget: const Placeholder(),
        item: const SidebarXItem(icon: Icons.people, label: 'People'),
      ),
      CHContainer(
        widget: const Placeholder(),
        item: const SidebarXItem(
          icon: Icons.favorite,
          label: 'Favorites',
          selectable: false,
          // onTap: () => _showDisabledAlert(context),
        ),
      ),
      CHContainer(
        widget: const Placeholder(),
        item: SidebarXItem(
          iconBuilder: (selected, hovered) => FlutterLogo(),
          label: 'Flutter',
        ),
      ),
    ];

    final List<SidebarXItem> items = widgets.map((item) => item.item).toList();

    return MaterialApp(
      title: 'SidebarX Example',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: primaryColor,
        canvasColor: canvasColor,
        scaffoldBackgroundColor: scaffoldBackgroundColor,
        textTheme: const TextTheme(
          headlineSmall: TextStyle(
            color: Colors.white,
            fontSize: 46,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      home: Builder(
        builder: (context) {
          final isSmallScreen = MediaQuery.of(context).size.width < 600;
          return Scaffold(
            key: _key,
            appBar:
                isSmallScreen
                    ? AppBar(
                      backgroundColor: canvasColor,
                      title: Text(
                        _getTitleByIndex(widgets, _controller.selectedIndex),
                        style: TextStyle(color: white),
                      ),
                      leading: IconButton(
                        onPressed: () {
                          // if (!Platform.isAndroid && !Platform.isIOS) {
                          //   _controller.setExtended(true);
                          // }
                          _key.currentState?.openDrawer();
                        },
                        icon: const Icon(Icons.menu, color: white),
                      ),
                    )
                    : null,
            drawer: ExampleSidebarX(controller: _controller, items: items),
            body: Row(
              children: [
                if (!isSmallScreen)
                  ExampleSidebarX(controller: _controller, items: items),
                Expanded(
                  child: Center(
                    child: _ScreensExample(
                      controller: _controller,
                      widgets: widgets,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class ExampleSidebarX extends StatelessWidget {
  const ExampleSidebarX({
    super.key,
    required this.controller,
    required this.items,
  });

  final List<SidebarXItem> items;
  final SidebarXController controller;

  @override
  Widget build(BuildContext context) {
    return SidebarX(
      controller: controller,
      theme: SidebarXTheme(
        margin: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: canvasColor,
          borderRadius: BorderRadius.circular(20),
        ),
        hoverColor: scaffoldBackgroundColor,
        textStyle: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
        selectedTextStyle: const TextStyle(color: Colors.white),
        hoverTextStyle: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
        itemTextPadding: const EdgeInsets.only(left: 30),
        selectedItemTextPadding: const EdgeInsets.only(left: 30),
        itemDecoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: canvasColor),
        ),
        selectedItemDecoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: actionColor.withValues(alpha: 0.37)),
          gradient: const LinearGradient(
            colors: [accentCanvasColor, canvasColor],
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.28),
              blurRadius: 30,
            ),
          ],
        ),
        iconTheme: IconThemeData(
          color: Colors.white.withValues(alpha: 0.7),
          size: 20,
        ),
        selectedIconTheme: const IconThemeData(color: Colors.white, size: 20),
      ),
      extendedTheme: const SidebarXTheme(
        width: 200,
        decoration: BoxDecoration(color: canvasColor),
      ),
      footerDivider: divider,
      headerBuilder: (context, extended) {
        return SizedBox(
          height: 100,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: FlutterLogo(),
          ),
        );
      },
      items: items,
    );
  }
}

class _ScreensExample extends StatelessWidget {
  const _ScreensExample({required this.controller, required this.widgets});

  final List<CHContainer> widgets;
  final SidebarXController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        return widgets[controller.selectedIndex].widget;
      },
    );
  }
}

String _getTitleByIndex(List<CHContainer> widgets, int index) {
  return widgets[index].item.label ?? 'Text Miss 文字缺失';
}

const primaryColor = Color(0xFF685BFF);
const canvasColor = Color(0xFF2E2E48);
const scaffoldBackgroundColor = Color(0xFF464667);
const accentCanvasColor = Color(0xFF3E3E61);
const white = Colors.white;
final actionColor = const Color(0xFF5F5FA7).withValues(alpha: 0.6);
final divider = Divider(color: white.withValues(alpha: 0.3), height: 1);
