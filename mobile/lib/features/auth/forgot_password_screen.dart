import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart'; // Make sure this exists or define it

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _passwordController = TextEditingController();
  int _step = 1;
  bool _isLoading = false;
  String _message = '';

  Future<void> _sendCode() async {
    setState(() { _isLoading = true; _message = ''; });
    try {
      final dio = ref.read(dioProvider);
      // Ensure backend route: /api/v1/auth/forgot-password
      final res = await dio.post('/auth/forgot-password', data: {'email': _emailController.text});
      setState(() {
        _isLoading = false;
        _step = 2;
        _message = 'Code sent! Check your email (or server log for dev).';
        // For dev convenience, if code is returned display it?
        if (res.data['devCode'] != null) {
           _message += ' (Dev Code: ${res.data['devCode']})';
        }
      });
    } catch (e) {
      setState(() { _isLoading = false; _message = 'Error: $e'; });
    }
  }

  Future<void> _resetPassword() async {
    setState(() { _isLoading = true; _message = ''; });
    try {
      final dio = ref.read(dioProvider);
      await dio.post('/auth/reset-password', data: {
        'email': _emailController.text,
        'code': _codeController.text,
        'newPassword': _passwordController.text
      });
      setState(() { _isLoading = false; _message = 'Success! Password reset.'; });
      if(mounted) {
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password reset successfully. Please login.')));
         Navigator.pop(context);
      }
    } catch (e) {
      setState(() { _isLoading = false; _message = 'Error: $e'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Forgot Password')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (_step == 1) ...[
              const Text('Enter your email to receive a reset code.'),
              const SizedBox(height: 20),
              TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder())),
              const SizedBox(height: 20),
              SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _sendCode, child: _isLoading ? const CircularProgressIndicator() : const Text('Send Reset Code'))),
            ] else ...[
              const Text('Enter the code sent to your email and your new password.'),
              const SizedBox(height: 20),
              TextField(controller: _codeController, decoration: const InputDecoration(labelText: 'Code', border: OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: _passwordController, decoration: const InputDecoration(labelText: 'New Password', border: OutlineInputBorder()), obscureText: true),
              const SizedBox(height: 20),
              SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _resetPassword, child: _isLoading ? const CircularProgressIndicator() : const Text('Reset Password'))),
            ],
            if (_message.isNotEmpty) ...[
              const SizedBox(height: 20),
              Text(_message, style: TextStyle(color: _message.contains('Success') ? Colors.green : Colors.red), textAlign: TextAlign.center),
            ]
          ],
        ),
      ),
    );
  }
}
