import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/course_repository.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../widgets/app_card.dart';
import '../../widgets/app_button.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

// Provider for courses
final coursesProvider = FutureProvider<List<Course>>((ref) async {
  return ref.watch(courseRepositoryProvider).getCourses();
});

class CoursesScreen extends ConsumerWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final coursesAsync = ref.watch(coursesProvider);

    return ScreenWrapper(
      appBar: AppBar(
        title: Text('Courses', style: AppTypography.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.primary),
            onPressed: () {
               context.push('/courses/add'); 
            },
          ),
        ],
      ),
      usePadding: false, // ListView has its own padding
      child: coursesAsync.when(
        data: (courses) {
            if (courses.isEmpty) {
              return EmptyStateWidget(
                title: 'No courses found',
                subtitle: 'Get started by creating a new course.',
                icon: Icons.school_outlined,
                actionLabel: 'Create Course',
                onAction: () => context.push('/courses/add'),
              );
            }
            return RefreshIndicator(
              onRefresh: () async => ref.refresh(coursesProvider),
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: courses.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final course = courses[index];
                  return _CourseCard(course: course);
                },
              ),
            );
        },
        loading: () => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: 6,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (_, __) => const ShimmerLoading.rectangular(height: 110, shapeBorder: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(16)))),
        ),
        error: (err, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              const SizedBox(height: 16),
              Text('Error loading courses', style: AppTypography.textTheme.titleMedium),
               const SizedBox(height: 8),
              Text(err.toString(), style: AppTypography.textTheme.bodySmall),
              const SizedBox(height: 16),
              AppButton(
                label: 'Retry',
                onPressed: () => ref.refresh(coursesProvider),
                type: AppButtonType.ghost,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  final Course course;

  const _CourseCard({required this.course});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: () => context.push('/courses/${course.id}'),
      padding: EdgeInsets.zero,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              width: 110,
              decoration: BoxDecoration(
                color: AppColors.grey200,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                ),
                image: course.thumbnail != null 
                    ? DecorationImage(image: NetworkImage(course.thumbnail!), fit: BoxFit.cover)
                    : null,
              ),
              child: course.thumbnail == null 
                ? const Icon(Icons.class_, size: 40, color: AppColors.grey400)
                : null,
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     Row(
                       children: [
                         Expanded(
                           child: Text(
                            course.title,
                            style: AppTypography.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                           ),
                         ),
                         IconButton(
                           icon: const Icon(Icons.chat_bubble_outline, size: 20),
                           color: AppColors.primary,
                           padding: EdgeInsets.zero,
                           constraints: const BoxConstraints(),
                           onPressed: () {
                             context.push('/courses/${course.id}/chat', extra: {
                               'courseId': course.id,
                               'courseTitle': course.title,
                             });
                           },
                         ),
                       ],
                     ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _Badge(text: course.category, color: AppColors.secondary),
                        const SizedBox(width: 8),
                        _Badge(text: course.difficultyLevel, isOutline: true),
                      ],
                    ),
                    const SizedBox(height: 10),
                     Text(
                      course.price != null ? '\$${course.price}' : 'Free',
                      style: AppTypography.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color? color;
  final bool isOutline;

  const _Badge({required this.text, this.color, this.isOutline = false});

  @override
  Widget build(BuildContext context) {
    if (isOutline) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.grey300),
          borderRadius: BorderRadius.circular(100),
        ),
        child: Text(
          text,
          style: AppTypography.textTheme.labelSmall?.copyWith(color: AppColors.grey600),
        ),
      );
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color?.withOpacity(0.15) ?? AppColors.grey200,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        text,
        style: AppTypography.textTheme.labelSmall?.copyWith(
          color: AppColors.grey900, // Better contrast
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
