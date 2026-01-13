import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state.dart';

final resourcesProvider = FutureProvider<List<dynamic>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get(ApiConstants.resources); 
  return response.data as List<dynamic>; 
});

class ResourceListScreen extends ConsumerWidget {
  const ResourceListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final resourcesAsync = ref.watch(resourcesProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Resources')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/resources/upload'),
        child: const Icon(Icons.upload_file),
      ),
      usePadding: false,
      child: resourcesAsync.when(
        data: (resources) {
             if (resources.isEmpty) {
               return const EmptyStateWidget(
                  title: 'No resources found',
                  subtitle: 'Upload documents to share with students.',
                  icon: Icons.folder_open,
               );
             }
             return ListView.builder(
               padding: const EdgeInsets.all(16),
               itemCount: resources.length,
               itemBuilder: (context, index) {
                 final r = resources[index];
                 return CustomCard(
                   child: ListTile(
                     leading: Container(
                       padding: const EdgeInsets.all(8),
                       decoration: BoxDecoration(
                         color: Colors.blue.withOpacity(0.1),
                         borderRadius: BorderRadius.circular(8),
                       ),
                       child: const Icon(Icons.description, color: Colors.blue),
                     ),
                     title: Text(
                        r['title'] ?? 'Untitled', 
                        style: const TextStyle(fontWeight: FontWeight.bold)
                     ),
                     subtitle: Text(r['url'] ?? 'No URL'),
                     trailing: IconButton(
                       icon: const Icon(Icons.download_rounded),
                       onPressed: () {
                         // Handle download/open
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
