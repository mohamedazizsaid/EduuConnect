import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';

final assignmentsProvider = FutureProvider.family<List<Assignment>, String>((ref, courseId) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('${ApiConstants.courses}/$courseId/assignments');
  return (response.data as List).map((e) => Assignment.fromJson(e)).toList();
});

class AssignmentsScreen extends ConsumerWidget {
  final String courseId;
  const AssignmentsScreen({super.key, required this.courseId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // FIXED: Changed ref.read to ref.watch to reactive updates
    final assignmentsAsync = ref.watch(assignmentsProvider(courseId));

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Assignments')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.push('/courses/$courseId/assignments/add');
        },
        child: const Icon(Icons.add),
      ),
      usePadding: false,
      child: assignmentsAsync.when(
        data: (assignments) {
          if (assignments.isEmpty) {
            return const EmptyStateWidget(
              title: 'No assignments yet',
              subtitle: 'Check back later for new tasks.',
              icon: Icons.assignment_outlined,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: assignments.length,
            itemBuilder: (context, index) {
              final assignment = assignments[index];
              return _AssignmentCard(assignment: assignment);
            },
          );
        },
        loading: () => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: 5,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (_, __) => const ShimmerLoading.rectangular(height: 80),
        ),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}

class _AssignmentCard extends StatelessWidget {
  final Assignment assignment;

  const _AssignmentCard({required this.assignment});

  @override
  Widget build(BuildContext context) {
    final dueDate = assignment.dueDate != null 
        ? DateFormat.yMMMd().format(assignment.dueDate!) 
        : 'No due date';

    return CustomCard(
      onTap: () => context.push('/assignments/${assignment.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  assignment.title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  dueDate,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Colors.red[700],
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            assignment.description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
        ],
      ),
    );
  }
}
