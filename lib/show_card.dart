import 'dart:io';

import 'package:intl/intl.dart';
import 'package:path/path.dart';
import 'package:test_build/ch_text_edior_controller.dart';
import 'package:test_build/lite_func_icons.dart';
import 'package:test_build/memos_database.dart';
import 'package:flutter/material.dart';
import 'package:test_build/upload_image.dart';

class ShowCard extends StatefulWidget {
  final bool canSwitch;
  final Memo? memo;
  final int index;
  final void Function(Memo value) addMemoToListView;
  final void Function(int value)? removeMemoFromListView;
  const ShowCard({
    super.key,
    required this.canSwitch,
    required this.addMemoToListView,
    this.removeMemoFromListView,
    this.memo,
    required this.index,
  });

  @override
  State<ShowCard> createState() => _ShowCardState();
}

class _ShowCardState extends State<ShowCard> {
  final textEditingController = CHTextEditingController();
  bool canEdit = false;
  final FocusNode focusNode = FocusNode();
  List<String> imageNames = [];
  bool initialized = false;
  Memo? memo;

  @override
  Widget build(BuildContext context) {
    if (widget.canSwitch) {
      if (!initialized) {
        initialized = true;
        memo = widget.memo!;
      }
      textEditingController.text = memo!.context;
      imageNames = memo!.images!;
    } else {
      canEdit = true;
    }
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(15),
      margin: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Theme.of(context).canvasColor,
        boxShadow: const [BoxShadow()],
      ),
      child: Column(
        children: [
          if (widget.canSwitch)
            // time 时间
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                getFormattedTime(memo!.creatDate),
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.start,
              ),
            ),
          SizedBox(height: 10),
          // inputField 输入框
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 300.0),
            child: GestureDetector(
              onDoubleTap: onDoubleTap,
              child: TextField(
                focusNode: focusNode,
                readOnly: !canEdit,
                controller: textEditingController,
                style: const TextStyle(color: Colors.white),
                maxLines: null,
                decoration: const InputDecoration(
                  isDense: true,
                  border: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  hintText: "请输入...",
                ),
              ),
            ),
          ),
          if (canEdit && imageNames.isNotEmpty)
            // images 图片
            SizedBox(
              height: 200,
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0, top: 8.0),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: imageNames.length,
                  itemBuilder: (context, index) {
                    late String path;
                    if (index < imageNames.length) {
                      path = join(sysAppDocDir.path, imageNames[index]);
                    }
                    return Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        color: Colors.white.withValues(alpha: 0.5),
                        boxShadow: const [BoxShadow()],
                      ),
                      margin: EdgeInsets.only(right: 8.0),
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: Image.file(File(path)),
                      ),
                    );
                  },
                ),
              ),
            ),
          if (canEdit) SizedBox(height: 10),
          // liteFuncIcons 小组件
          if (canEdit) LiteFuncIcons(onClickImage: onClickPicupImage),
          if (canEdit)
            const Divider(
              thickness: 1,
              indent: 10,
              endIndent: 10,
              color: Colors.white12,
            ),
          if (canEdit)
            // button 按钮
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (widget.canSwitch)
                  TextButton(
                    onPressed: onRemoveMemo,
                    child: Text("删除", style: TextStyle(color: Colors.red)),
                  ),
                Padding(
                  padding: const EdgeInsets.only(left: 10.0),
                  child: ElevatedButton(
                    onPressed: onSaveMemo,
                    child: const Text("保存"),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  void onCancelEdit() {}

  void onStartEdit() {
    memo = widget.memo!.copy();
  }

  void onDoubleTap() {
    setState(() {
      canEdit = !canEdit;
      if (canEdit) {
        onStartEdit();
        focusNode.requestFocus();
      }
      if (!canEdit) {
        focusNode.unfocus();
        onCancelEdit();
      }
    });
  }

  // fensh time 格式化时间
  String getFormattedTime(int timestamp) {
    DateTime dateTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
    return DateFormat('yyyy-MM-dd EEEE HH:mm:ss').format(dateTime);
  }

  void onRemoveMemo() {}

  void onSaveMemo() {
    if (!widget.canSwitch) {
      MemoDatabase.instance.create(textEditingController.text, null);
    } else {
      MemoDatabase.instance
          .updateContext(memo!.id, textEditingController.text)
          .then((value) {
            setState(() {
              canEdit = false;
            });
          });
    }
  }

  void onClickPicupImage() {
    pickUpImages().then((value) {
      if (value == null) return;
      setState(() {});
    });
  }
}
