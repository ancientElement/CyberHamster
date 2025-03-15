import 'package:test_build/memos_database.dart';
import 'package:test_build/show_card.dart';
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool init = false;
  List<Memo> memos = [];

  void reBuildMemoListView() {
    MemoDatabase.instance.readAllMemos().then((value) {
      setState(() {
        memos = value;
      });
    });
  }

  void addMemoToListView(Memo memo) {
    setState(() {
      memos.insert(0, memo);
    });
  }

  void removeMemoFromListView(int index) {
    setState(() {
      memos.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!init) {
      reBuildMemoListView();
      init = true;
    }
    print('build home');
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: ListView.builder(
        itemCount: memos.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return ShowCard(
              index: -1,
              canSwitch: false,
              addMemoToListView: addMemoToListView,
            );
          }
          return ShowCard(
            key: Key('show_card_${memos[index - 1].id}'),
            canSwitch: true,
            memo: memos[index - 1],
            addMemoToListView: addMemoToListView,
            removeMemoFromListView: removeMemoFromListView,
            index: index - 1,
          );
        },
      ),
    );
  }
}
