import 'package:test_build/ch_text_edior_controller.dart';
import 'package:test_build/lite_func_icons.dart';
import 'package:test_build/memos_database.dart';
import 'package:flutter/material.dart';

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
  final textEditingController = CHTextEditingController(
    textMap: {RegExp.escape('-[]'): '✅'},
    textStyleMap: {
      RegExp.escape('apple'): const TextStyle(
        color: Colors.green,
        decoration: TextDecoration.underline,
        fontSize: 36,
      ),
      RegExp.escape('orange'): TextStyle(
        color: Colors.orange,
        shadows: kElevationToShadow[2],
      ),
      r'^https?:\/\/[\w\-]+(\.[\w\-]+)*(:\d+)?([\/\?#].*)?$': const TextStyle(
        color: Colors.blue,
        decoration: TextDecoration.underline,
      ),
    },
  );

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
          const SizedBox(height: 10.0),
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
                        .create(textEditingController.text)
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
