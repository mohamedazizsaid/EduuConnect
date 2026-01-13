import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        children: [
          _buildPage(context, 'Welcome to EduConnect', 'Learn anytime, anywhere.', Colors.blue, false),
          _buildPage(context, 'Track Progress', 'Earn certificates on blockchain.', Colors.green, false),
          _buildPage(context, 'AI Powered', 'Get smart recommendations.', Colors.purple, true),
        ],
      ),
    );
  }

  Widget _buildPage(BuildContext context, String title, String subtitle, Color color, bool isLast) {
    return Container(
      color: Colors.white,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.school, size: 100, color: color),
          const SizedBox(height: 20),
          Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Text(subtitle, style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 50),
          if (isLast)
            ElevatedButton(
              onPressed: () => context.go('/login'),
              child: const Text('Get Started'),
            ),
        ],
      ),
    );
  }
}
