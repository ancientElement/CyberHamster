import 'dart:io';

import 'package:file_picker/file_picker.dart';
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
  final int? index;
  final void Function(Memo value) addMemoToListView;
  final void Function(int value)? removeMemoFromListView;

  const ShowCard({
    super.key,
    required this.canSwitch,
    this.memo,
    this.index,
    required this.addMemoToListView,
    this.removeMemoFromListView,
  });

  @override
  State<ShowCard> createState() => _ShowCardState();
}

class _ShowCardState extends State<ShowCard> {
  final TextSelectionControls selectionControls =
      MaterialTextSelectionControls();
  final foucsNode = FocusNode();
  bool canEdit = false;
  List<String> imageNames = [];
  List<PlatformFile> imagesWillAdd = [];
  List<String> imagesWillRemove = [];
  // register ruler 注册文本规则
  final textEditingController = CHTextEditingController();

  // fensh time 格式化时间
  String getFormattedTime(int timestamp) {
    DateTime dateTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
    return DateFormat('yyyy-MM-dd EEEE HH:mm:ss').format(dateTime);
  }

  @override
  void dispose() {
    super.dispose();
    textEditingController.dispose();
    foucsNode.dispose();
  }

  @override
  void initState() {
    super.initState();
    if (widget.canSwitch) {
      reloadData();
    }
  }

  void reloadData() {
    textEditingController.text = widget.memo!.context;
    if (widget.memo!.images != null) {
      imageNames = widget.memo!.images!.toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final canSwitch = widget.canSwitch;
    canEdit = canSwitch ? widget.memo!.editorData.canEdit : true;
    late String time;
    if (canSwitch) {
      time = getFormattedTime(widget.memo!.creatDate);
    }
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10, right: 10, left: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Theme.of(context).canvasColor,
        boxShadow: const [BoxShadow()],
      ),
      child: Column(
        children: [
          if (canSwitch)
            Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0, top: 10.0),
                child: Text(
                  time,
                  style: TextStyle(color: Colors.white),
                  textAlign: TextAlign.start,
                ),
              ),
            ),
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 300.0),
            child: Padding(
              padding: const EdgeInsets.only(left: 20, top: 10.0, right: 20),
              child: GestureDetector(
                onDoubleTap: () {
                  // double click 处理双击事件
                  if (canSwitch) {
                    setState(() {
                      canEdit = !canEdit;
                      widget.memo!.editorData.canEdit = canEdit;
                      foucsNode.requestFocus();
                      //canel 取消
                      if (!canEdit) {
                        imagesWillRemove.clear();
                        imagesWillAdd.clear();
                        reloadData();
                      }
                    });
                  }
                },
                child: TextField(
                  focusNode: foucsNode,
                  controller: textEditingController,
                  readOnly: !canEdit,
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
          ),
          if ((imageNames.isNotEmpty || imagesWillAdd.isNotEmpty))
            SizedBox(
              height: canEdit ? 40 : 200,
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0, top: 8.0),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: imageNames.length + imagesWillAdd.length,
                  itemBuilder: (context, index) {
                    late String path;
                    if (index < imageNames.length) {
                      path = join(sysAppDocDir.path, imageNames[index]);
                    } else {
                      path = imagesWillAdd[index - imageNames.length].path!;
                    }
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: const [BoxShadow()],
                      ),
                      margin: EdgeInsets.only(right: 8.0),
                      child: Row(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(4.0),
                            child: Image.file(File(path)),
                          ),
                          if (canEdit)
                            IconButton(
                              padding: EdgeInsets.all(0),
                              onPressed: () {
                                setState(() {
                                  // delete image 删除图片
                                  if (index < imageNames.length) {
                                    imagesWillRemove.add(imageNames[index]);
                                    imageNames.removeAt(index);
                                  } else {
                                    imagesWillAdd.removeAt(
                                      index - imageNames.length,
                                    );
                                  }
                                });
                              },
                              icon: Icon(
                                Icons.highlight_remove,
                                color: Colors.white70,
                              ),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          const SizedBox(height: 10.0),
          if (canEdit)
            Padding(
              padding: const EdgeInsets.only(left: 20.0),
              child: LiteFuncIcons(
                onClickImage: () {
                  pickUpImages().then((value) {
                    if (value == null) return;
                    setState(() {
                      imagesWillAdd.addAll(value);
                    });
                  });
                },
              ),
            ),
          if (canEdit)
            const Divider(
              thickness: 1,
              indent: 20,
              endIndent: 20,
              color: Colors.white12,
            ),
          if (canEdit)
            Padding(
              padding: const EdgeInsets.only(right: 20.0, bottom: 10.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      if (canSwitch) {
                        MemoDatabase.instance
                            .updateContext(
                              widget.memo!.id,
                              textEditingController.text,
                            )
                            .then((value) {
                              widget.memo!.context = textEditingController.text;
                              setState(() {
                                canEdit = false;
                                widget.memo!.editorData.canEdit = canEdit;
                              });
                            });
                        if (imagesWillAdd.isNotEmpty) {
                          uploadImage(imagesWillAdd).then((images) {
                            MemoDatabase.instance
                                .updateImages(widget.memo!.id, images!)
                                .then((value) {
                                  setState(() {
                                    imagesWillAdd.clear();
                                    imageNames.addAll(images);
                                  });
                                });
                          });
                        }
                        if (imagesWillRemove.isNotEmpty) {
                          MemoDatabase.instance
                              .deleteImages(imagesWillRemove)
                              .then((value) {
                                deleteImages(imagesWillRemove);
                                imagesWillRemove.clear();
                              });
                        }
                      } else {
                        uploadImage(imagesWillAdd).then((images) {
                          MemoDatabase.instance
                              .create(textEditingController.text, images!)
                              .then((value) {
                                widget.addMemoToListView(value);
                              });
                        });
                      }
                    },
                    child: const Text("保存"),
                  ),
                  if (canSwitch && canEdit) const SizedBox(width: 10),
                  if (canSwitch && canEdit)
                    ElevatedButton(
                      onPressed: () {
                        MemoDatabase.instance.delete(widget.memo!.id).then((
                          value,
                        ) {
                          deleteImages(imageNames);
                          widget.removeMemoFromListView!(widget.index!);
                        });
                      },
                      child: const Text("删除"),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
