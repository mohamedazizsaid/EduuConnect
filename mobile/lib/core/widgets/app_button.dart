import 'package:flutter/material.dart';

enum AppButtonType { primary, secondary, outline, text }

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isDisabled;
  final IconData? icon;
  final AppButtonType type;
  final bool isFullWidth;

  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.isDisabled = false,
    this.icon,
    this.type = AppButtonType.primary,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final onPressedAction = (isDisabled || isLoading) ? null : onPressed;

    Widget buttonContent = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: type == AppButtonType.primary ? Colors.white : Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(width: 8),
        ] else if (icon != null) ...[
          Icon(icon, size: 20),
          const SizedBox(width: 8),
        ],
        Text(label),
      ],
    );

    Widget button;
    final style = SimpleButtonStyle(isFullWidth: isFullWidth);

    switch (type) {
      case AppButtonType.primary:
        button = FilledButton(
          onPressed: onPressedAction,
          style: FilledButton.styleFrom(
            minimumSize: style.minimumSize,
            padding: style.padding,
            shape: style.shape,
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.secondary:
        button = FilledButton.tonal(
          onPressed: onPressedAction,
          style: FilledButton.styleFrom(
            minimumSize: style.minimumSize,
            padding: style.padding,
            shape: style.shape,
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.outline:
        button = OutlinedButton(
          onPressed: onPressedAction,
          style: OutlinedButton.styleFrom(
            minimumSize: style.minimumSize,
            padding: style.padding,
            shape: style.shape,
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.text:
        button = TextButton(
          onPressed: onPressedAction,
          style: TextButton.styleFrom(
            minimumSize: style.minimumSize,
            padding: style.padding,
            shape: style.shape,
          ),
          child: buttonContent,
        );
        break;
    }

    if (isFullWidth) {
      return SizedBox(width: double.infinity, child: button);
    }
    return button;
  }
}

class SimpleButtonStyle {
  final bool isFullWidth;
  SimpleButtonStyle({this.isFullWidth = false});

  Size get minimumSize => const Size(64, 48); // Min height 48px for touch targets
  EdgeInsetsGeometry get padding => const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
  OutlinedBorder get shape => RoundedRectangleBorder(borderRadius: BorderRadius.circular(12));
}
