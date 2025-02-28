import 'package:flutter/material.dart';

class CHTextEditingController extends TextEditingController {
  final Map<String, TextStyle> textStyleMap;
  final Map<String, String> textMap;
  final List<String> textStyleMapKeys;
  final List<String> textMapKeys;
  final Pattern textStylePattern;
  final Pattern textPattern;

  CHTextEditingController({required this.textStyleMap, required this.textMap})
      : textStyleMapKeys = textStyleMap.keys.toList(),
        textStylePattern = RegExp(
            textStyleMap.keys.map((key) => '($key)').join('|'),
            multiLine: true),
        textMapKeys = textMap.keys.toList(),
        textPattern = RegExp(
          textMap.keys.map((key) => '($key)').join('|'),
          multiLine: true,
        );

  String replaceText() {
    return text.splitMapJoin(
      textPattern,
      onMatch: (Match match) {
        String? matchedKey;
        for (int i = 0; i < textMapKeys.length; i++) {
          if (match.group(i + 1) != null) {
            matchedKey = textMapKeys[i];
            break;
          }
        }
        if (matchedKey != null) {
          final displayText = textMap[matchedKey]!;
          return displayText;
        } else {
          return match[0]!;
        }
      },
      onNonMatch: (String text) {
        return text;
      },
    );
  }

  @override
  TextSpan buildTextSpan({
    required BuildContext context,
    TextStyle? style,
    required bool withComposing,
  }) {
    final defaultStyle = DefaultTextStyle.of(context).style;
    final effectiveStyle = style ?? defaultStyle;
    List<InlineSpan> children = [];
    text.splitMapJoin(
      textStylePattern,
      onMatch: (Match match) {
        String? matchedKey;
        for (int i = 0; i < textStyleMapKeys.length; i++) {
          if (match.group(i + 1) != null) {
            matchedKey = textStyleMapKeys[i];
            break;
          }
        }

        if (matchedKey != null) {
          final tempStyle = textStyleMap[matchedKey];
          final displayText = match[0]!;
          children.add(
            TextSpan(
              text: displayText,
              style: effectiveStyle.merge(tempStyle),
            ),
          );
          return displayText;
        } else {
          children.add(TextSpan(text: match[0], style: effectiveStyle));
          return match[0]!;
        }
      },
      onNonMatch: (String text) {
        children.add(TextSpan(text: text, style: effectiveStyle));
        return text;
      },
    );
    return TextSpan(style: effectiveStyle, children: children);
  }
}
