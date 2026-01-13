import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';

final usersProvider = FutureProvider<List<User>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get(ApiConstants.users);
  return (response.data as List).map((e) => User.fromJson(e)).toList();
});

class TeacherManagementScreen extends ConsumerWidget {
  const TeacherManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
     final usersAsync = ref.watch(usersProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Teacher Management')),
      usePadding: false,
      child: usersAsync.when(
        data: (users) {
            if (users.isEmpty) return const EmptyStateWidget(title: 'No users found', icon: Icons.people_outline);
            
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return CustomCard(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: user.role == 'teacher' ? Colors.deepPurple[100] : Colors.grey[200],
                      child: Icon(
                        user.role == 'teacher' ? Icons.school : Icons.person,
                        color: user.role == 'teacher' ? Colors.deepPurple : Colors.grey,
                      ),
                    ),
                    title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('${user.email} • ${user.role}'),
                    trailing: PopupMenuButton(
                      icon: const Icon(Icons.more_vert),
                      itemBuilder: (context) => [
                        if (user.role != 'teacher')
                           const PopupMenuItem(value: 'promote', child: Row(children: [Icon(Icons.arrow_upward, size: 16), SizedBox(width: 8), Text('Make Teacher')])),
                        if (user.role == 'teacher')
                           const PopupMenuItem(value: 'demote', child: Row(children: [Icon(Icons.arrow_downward, size: 16), SizedBox(width: 8), Text('Make Student')])),
                        const PopupMenuItem(value: 'delete', child: Row(children: [Icon(Icons.delete, color: Colors.red, size: 16), SizedBox(width: 8), Text('Delete', style: TextStyle(color: Colors.red))])),
                      ],
                      onSelected: (value) async {
                          // Ideally show confirmation dialog
                          final dio = ref.read(dioProvider);
                          if (value == 'delete') {
                             await dio.delete('${ApiConstants.users}/${user.id}');
                          } else {
                             final newRole = value == 'promote' ? 'teacher' : 'student';
                             await dio.patch('${ApiConstants.users}/${user.id}/role', data: {'role': newRole});
                          }
                          ref.refresh(usersProvider);
                      },
                    ),
                  ),
                );
              },
            );
        },
        loading: () => ListView.separated(
           padding: const EdgeInsets.all(16),
           itemCount: 6,
           separatorBuilder: (_, __) => const SizedBox(height: 12),
           itemBuilder: (_, __) => const ShimmerLoading.rectangular(height: 72),
        ),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
