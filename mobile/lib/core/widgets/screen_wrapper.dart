import 'package:flutter/material.dart';

class ScreenWrapper extends StatelessWidget {
  final Widget child;
  final bool usePadding;
  final FloatingActionButton? floatingActionButton;
  final PreferredSizeWidget? appBar;
  final Widget? bottomNavigationBar;
  final Widget? drawer;
  final Color? backgroundColor;

  const ScreenWrapper({
    super.key,
    required this.child,
    this.usePadding = true,
    this.floatingActionButton,
    this.appBar,
    this.bottomNavigationBar,
    this.drawer,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar,
      drawer: drawer,
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: bottomNavigationBar,
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            // Responsive constraints
            if (constraints.maxWidth > 600) {
              // Tablet / Desktop layout constraint
              return Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 600),
                  child: _buildBody(context),
                ),
              );
            }
            return _buildBody(context);
          },
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    if (usePadding) {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: child,
      );
    }
    return child;
  }
}
