import 'package:flutter/material.dart';

class CHTextEditingController extends TextEditingController {
  final RegExp urlReg = RegExp(
    r"^((((H|h)(T|t)|(F|f))(T|t)(P|p)((S|s)?))\://)?(www.|[a-zA-Z0-9].)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\:[0-9]{1,5})*(/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-@]+))*$",
  );
  final urlTextStyle = const TextStyle(
    color: Colors.blue,
    decoration: TextDecoration.underline,
    decorationColor: Colors.blue,
  );

  @override
  TextSpan buildTextSpan({
    required BuildContext context,
    TextStyle? style,
    required bool withComposing,
  }) {
    final defaultStyle = DefaultTextStyle.of(context).style;
    final effectiveStyle = style ?? defaultStyle;
    List<InlineSpan> children = [];
    final textList = text.split(' ');
    print(textList);
    for (var i = 0; i < textList.length; i++) {
      final item = textList[i];
      if (urlReg.hasMatch(item)) {
        children.add(TextSpan(text: item, style: urlTextStyle));
      } else {
        children.add(TextSpan(text: item));
      }
      children.add(TextSpan(text: ' '));
    }
    return TextSpan(style: effectiveStyle, children: children);
  }
}
