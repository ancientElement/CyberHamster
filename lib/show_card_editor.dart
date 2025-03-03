import 'dart:io';

import 'package:path/path.dart';
import 'package:test_build/ch_text_edior_controller.dart';
import 'package:test_build/lite_func_icons.dart';
import 'package:test_build/memos_database.dart';
import 'package:flutter/material.dart';
import 'package:test_build/upload_image.dart';

class ShowCardEditor extends StatefulWidget {
  final void Function(Memo value) addMemoToListView;

  const ShowCardEditor({super.key, required this.addMemoToListView});

  @override
  State<ShowCardEditor> createState() => _ShowCardState();
}

class _ShowCardState extends State<ShowCardEditor> {
  final TextSelectionControls selectionControls =
      MaterialTextSelectionControls();

  // register ruler 注册文本规则
  final textEditingController = CHTextEditingController();

  final imageNames = <String>[];

  @override
  void dispose() {
    super.dispose();
    textEditingController.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 300.0),
            child: Padding(
              padding: const EdgeInsets.only(left: 20, top: 10, right: 20),
              child: TextField(
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
          if (imageNames.isNotEmpty)
            SizedBox(
              height: 40,
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0, top: 8.0),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: imageNames.length,
                  itemBuilder: (context, index) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: const [BoxShadow()],
                      ),
                      margin: EdgeInsets.only(right: 8.0),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Image.file(
                          File(join(sysAppDocDir.path, imageNames[index])),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: LiteFuncIcons(
              onSaveImages: (value) {
                setState(() {
                  for (final imageName in value) {
                    imageNames.add(imageName);
                  }
                });
              },
            ),
          ),
          const Divider(
            thickness: 1,
            indent: 20,
            endIndent: 20,
            color: Colors.white12,
          ),
          Padding(
            padding: const EdgeInsets.only(right: 20.0, bottom: 10.0),
            child: Row(
              textDirection: TextDirection.rtl,
              children: [
                ElevatedButton(
                  onPressed: () {
                    MemoDatabase.instance
                        .create(textEditingController.text, imageNames)
                        .then((value) {
                          widget.addMemoToListView(value);
                        });
                  },
                  child: const Text("保存"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
