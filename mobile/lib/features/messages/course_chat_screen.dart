import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import 'chat_screen.dart';

// Provider to get or create conversation for a course
final courseConversationProvider = FutureProvider.family<String, String>((ref, courseId) async {
  final dio = ref.read(dioProvider);
  try {
    final response = await dio.get('${ApiConstants.conversations}/course/$courseId');
    return response.data['id'] as String;
  } catch (e) {
    throw Exception('Failed to get course conversation: $e');
  }
});

class CourseChatScreen extends ConsumerWidget {
  final String courseId;
  final String courseTitle;
  
  const CourseChatScreen({
    super.key, 
    required this.courseId,
    required this.courseTitle,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationAsync = ref.watch(courseConversationProvider(courseId));

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(courseTitle),
            const Text(
              'Course Discussion',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
            ),
          ],
        ),
      ),
      body: conversationAsync.when(
        data: (conversationId) => ChatScreen(
          conversationId: conversationId,
          courseTitle: courseTitle,
        ),
        loading: () => const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Loading conversation...'),
            ],
          ),
        ),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text('Error: $error'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(courseConversationProvider(courseId)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
