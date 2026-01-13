import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_colors.dart';

enum AppButtonType { primary, secondary, ghost, outline }

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final AppButtonType type;
  final IconData? icon;
  final bool fullWidth;

  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.type = AppButtonType.primary,
    this.icon,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget buttonContent = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 8),
        ] else if (icon != null) ...[
          Icon(icon, size: 18),
          const SizedBox(width: 8),
        ],
        Text(label),
      ],
    );

    Widget button;
    
    switch (type) {
      case AppButtonType.primary:
        button = FilledButton(
          onPressed: isLoading ? null : onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
          ).copyWith(
            elevation: MaterialStateProperty.resolveWith((states) {
               if (states.contains(MaterialState.pressed)) return 0;
               return 4; // Glow effect
            }),
            shadowColor: MaterialStateProperty.all(AppColors.primary.withOpacity(0.4)),
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.secondary:
        button = FilledButton(
          onPressed: isLoading ? null : onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.secondary,
            foregroundColor: AppColors.grey900,
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.outline:
        button = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.grey800,
            side: const BorderSide(color: AppColors.grey300),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          ),
          child: buttonContent,
        );
        break;
      case AppButtonType.ghost:
        button = TextButton(
          onPressed: isLoading ? null : onPressed,
           style: TextButton.styleFrom(
            foregroundColor: AppColors.grey700,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
             padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          child: buttonContent,
        );
        break;
    }

    if (fullWidth) {
      return SizedBox(width: double.infinity, child: button)
        .animate(target: isLoading ? 1 : 0)
        .shimmer(duration: 1.seconds, color: Colors.white24);
    }
    
    return button;
  }
}
