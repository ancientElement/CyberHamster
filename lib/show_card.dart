import 'package:intl/intl.dart';
import 'package:test_build/ch_text_edior_controller.dart';
import 'package:test_build/lite_func_icons.dart';
import 'package:test_build/memos_database.dart';
import 'package:flutter/material.dart';

class ShowCard extends StatefulWidget {
  final Memo memo;
  final int index;
  final void Function(Memo value) addMemoToListView;
  final void Function(int value) removeMemoFromListView;

  const ShowCard({
    super.key,
    required this.memo,
    required this.index,
    required this.addMemoToListView,
    required this.removeMemoFromListView,
  });

  @override
  State<ShowCard> createState() => _ShowCardState();
}

class _ShowCardState extends State<ShowCard> {
  final TextSelectionControls selectionControls =
      MaterialTextSelectionControls();
  final foucsNode = FocusNode();
  bool canEdit = false;

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
  Widget build(BuildContext context) {
    textEditingController.text = widget.memo.context;
    canEdit = widget.memo.editorData.canEdit;
    final time = getFormattedTime(widget.memo.creatDate);
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
                  setState(() {
                    canEdit = !canEdit;
                    widget.memo.editorData.canEdit = canEdit;
                    foucsNode.requestFocus();
                  });
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
          const SizedBox(height: 10.0),
          if (canEdit)
            Padding(
              padding: const EdgeInsets.only(left: 20.0),
              child: LiteFuncIcons(),
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
                      MemoDatabase.instance
                          .updateContext(
                            widget.memo.id,
                            textEditingController.text,
                          )
                          .then((value) {
                            widget.memo.context = textEditingController.text;
                            setState(() {
                              canEdit = false;
                              widget.memo.editorData.canEdit = canEdit;
                            });
                          });
                    },
                    child: const Text("保存"),
                  ),
                  if (canEdit) const SizedBox(width: 10),
                  if (canEdit)
                    ElevatedButton(
                      onPressed: () {
                        MemoDatabase.instance.delete(widget.memo.id).then((
                          value,
                        ) {
                          widget.removeMemoFromListView(widget.index);
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
