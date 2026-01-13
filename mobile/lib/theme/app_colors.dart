import 'package:flutter/material.dart';

class AppColors {
  // Primary Palette
  static const Color primary = Color(0xFF5B8CFF);
  static const Color primaryDark = Color(0xFF3A6BC5);
  static const Color primaryLight = Color(0xFF8BAFFF);
  
  // Secondary Palette
  static const Color secondary = Color(0xFFFFB020);
  static const Color secondaryDark = Color(0xFFCC8800);
  static const Color secondaryLight = Color(0xFFFFD470);

  // Neutral Palette
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF1A1A1A);
  static const Color grey50 = Color(0xFFF9FAFB);
  static const Color grey100 = Color(0xFFF3F4F6);
  static const Color grey200 = Color(0xFFE5E7EB);
  static const Color grey300 = Color(0xFFD1D5DB);
  static const Color grey400 = Color(0xFF9CA3AF);
  static const Color grey500 = Color(0xFF6B7280);
  static const Color grey600 = Color(0xFF4B5563);
  static const Color grey700 = Color(0xFF374151);
  static const Color grey800 = Color(0xFF1F2937);
  static const Color grey900 = Color(0xFF111827);

  // Semantic
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // Shadows
  static List<BoxShadow> get shadowSm => [
    BoxShadow(color: black.withOpacity(0.05), blurRadius: 2, offset: const Offset(0, 1)),
  ];
  
  static List<BoxShadow> get shadowMd => [
    BoxShadow(color: black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
    BoxShadow(color: primary.withOpacity(0.08), blurRadius: 16, offset: const Offset(0, 8)),
  ];

  static List<BoxShadow> get shadowLg => [
    BoxShadow(color: black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
    BoxShadow(color: primary.withOpacity(0.12), blurRadius: 24, offset: const Offset(0, 12)),
  ];
}
