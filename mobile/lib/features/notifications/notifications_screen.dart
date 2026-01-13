import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/app_button.dart';

final notificationsProvider = FutureProvider<List<AppNotification>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get(ApiConstants.notifications);
  return (response.data as List).map((e) => AppNotification.fromJson(e)).toList();
});

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifsAsync = ref.watch(notificationsProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Notifications')),
      floatingActionButton: FloatingActionButton(
         onPressed: () {
             Navigator.push(context, MaterialPageRoute(builder: (_) => const ReminderCreateScreen()));
         },
         child: const Icon(Icons.alarm_add),
      ),
      usePadding: false,
      child: notifsAsync.when(
        data: (notifs) {
            if (notifs.isEmpty) {
              return const EmptyStateWidget(
                title: 'No new notifications',
                subtitle: 'You are all caught up!',
                icon: Icons.notifications_none,
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifs.length,
              itemBuilder: (context, index) {
                final n = notifs[index];
                return CustomCard(
                  child: ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.deepPurple.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.notifications, color: Colors.deepPurple),
                    ),
                    title: Text(n.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(n.message),
                    trailing: n.isRead ? null : const Icon(Icons.circle, color: Colors.red, size: 10),
                  ),
                );
              },
            );
        },
        loading: () => ListView.separated(
           padding: const EdgeInsets.all(16),
           itemCount: 6,
           separatorBuilder: (_, __) => const SizedBox(height: 12),
           itemBuilder: (_, __) => const ShimmerLoading.rectangular(height: 80),
        ),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}

class ReminderCreateScreen extends ConsumerStatefulWidget {
  const ReminderCreateScreen({super.key});

  @override
  ConsumerState<ReminderCreateScreen> createState() => _ReminderCreateScreenState();
}

class _ReminderCreateScreenState extends ConsumerState<ReminderCreateScreen> {
  final _titleController = TextEditingController();
  bool _isLoading = false;
  
  Future<void> _create() async {
      final text = _titleController.text.trim();
      if(text.isEmpty) return;

      setState(() => _isLoading = true);
      try {
          final dio = ref.read(dioProvider);
          await dio.post(ApiConstants.notifications, data: { 
              'title': text,
              'message': 'Reminder: $text',
              'type': 'Reminder'
          });
          if(mounted) Navigator.pop(context);
      } catch (e) {
          if(mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      } finally {
        if(mounted) setState(() => _isLoading = false);
      }
  }

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      appBar: AppBar(title: const Text('Create Reminder')),
      child: CustomCard(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _titleController, 
                decoration: const InputDecoration(labelText: 'Reminder Title', prefixIcon: Icon(Icons.title)),
              ),
              const SizedBox(height: 24),
              AppButton(
                label: 'Set Reminder',
                onPressed: _create,
                isLoading: _isLoading,
                isFullWidth: true,
                icon: Icons.alarm,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
