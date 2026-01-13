import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';

final conversationsProvider = FutureProvider<List<Conversation>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get(ApiConstants.conversations);
  return (response.data as List).map((e) => Conversation.fromJson(e)).toList();
});

class ConversationScreen extends ConsumerWidget {
  const ConversationScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Messages')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // New conversation (Select user)
        },
        child: const Icon(Icons.message),
      ),
      usePadding: false,
      child: conversationsAsync.when(
        data: (conversations) {
            if (conversations.isEmpty) {
              return const EmptyStateWidget(
                title: 'No messages yet',
                subtitle: 'Start a conversation with a teacher or student.',
                icon: Icons.chat_bubble_outline,
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: conversations.length,
              itemBuilder: (context, index) {
                final conv = conversations[index];
                return CustomCard(
                  child: ListTile(
                    leading: const CircleAvatar(child: Icon(Icons.person)),
                    title: Text('Conversation ${conv.id.substring(0, 4)}...', style: const TextStyle(fontWeight: FontWeight.bold)), // Should show user name
                    subtitle: Text(conv.lastMessage ?? 'No messages', maxLines: 1, overflow: TextOverflow.ellipsis),
                    trailing: Text(
                      'Now', // Time
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    onTap: () {
                      context.push('/chat/${conv.id}');
                    },
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
