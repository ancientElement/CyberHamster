import 'package:flutter/material.dart';

class LiteFuncIcons extends StatelessWidget {
  final void Function()? onClickTag;
  final void Function()? onClickLink;
  final void Function()? onClickImage;

  const LiteFuncIcons({
    super.key,
    this.onClickTag,
    this.onClickLink,
    this.onClickImage,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.numbers, color: Colors.white),
          onPressed: onClickTag,
        ),
        IconButton(
          icon: const Icon(Icons.link, color: Colors.white),
          onPressed: onClickLink,
        ),
        IconButton(
          icon: const Icon(Icons.image_outlined, color: Colors.white),
          onPressed: onClickImage,
        ),
      ],
    );
  }
}
