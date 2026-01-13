import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/course_repository.dart';
import '../../data/models/app_models.dart';

final courseDetailsProvider = FutureProvider.family<Course, String>((ref, id) async {
  return ref.watch(courseRepositoryProvider).getCourse(id);
});

class CourseDetailScreen extends ConsumerWidget {
  final String courseId;

  const CourseDetailScreen({super.key, required this.courseId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final courseAsync = ref.watch(courseDetailsProvider(courseId));

    return Scaffold(
      appBar: AppBar(title: const Text('Course Details')),
      body: courseAsync.when(
        data: (course) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(course.title, style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 8),
              Text(course.description),
              const SizedBox(height: 16),
              Text('Category: ${course.category}'),
              Text('Level: ${course.difficultyLevel}'),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  // Enroll logic
                },
                child: const Text('Enroll'),
              ),
              const Divider(),
              ListTile(
                title: const Text('Assignments'),
                trailing: const Icon(Icons.arrow_forward),
                onTap: () {
                   // Navigate to assignments
                   context.push('/courses/$courseId/assignments');
                },
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
