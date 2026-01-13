import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/auth_repository.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../widgets/app_card.dart'; // Use AppCard
import '../../widgets/app_button.dart'; // Use AppButton
import '../../theme/app_typography.dart';
import '../../core/providers/user_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return ScreenWrapper(
       appBar: AppBar(title: const Text('Profile')),
       child: RefreshIndicator(
         onRefresh: () => ref.refresh(currentUserProvider.future),
         child: SingleChildScrollView(
           physics: const AlwaysScrollableScrollPhysics(),
           child: Column(
             children: [
               Center(
                 child: userAsync.when(
                   data: (user) => Column(
                     children: [
                       Container(
                         width: 100,
                         height: 100,
                         decoration: BoxDecoration(
                           color: Colors.blue.shade50,
                           shape: BoxShape.circle,
                           border: Border.all(
                             color: Colors.blue.shade200,
                             width: 3,
                           ),
                         ),
                         child: Icon(
                           Icons.person,
                           size: 60,
                           color: Colors.blue.shade700,
                         ),
                       ),
                       const SizedBox(height: 16),
                       Text(
                         user?.name ?? 'Guest User',
                         style: AppTypography.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                       ),
                       Text(
                         user?.email ?? 'No email',
                         style: AppTypography.textTheme.bodyLarge?.copyWith(color: Colors.grey),
                       ),
                        const SizedBox(height: 8),
                       Chip(label: Text(user?.role ?? 'Student')),
                     ],
                   ),
                   loading: () => const CircularProgressIndicator(),
                   error: (err, stack) => const Text('Error loading profile'),
                 ),
               ),
               const SizedBox(height: 32),
               AppCard(
                 padding: EdgeInsets.zero,
                 child: Column(
                   children: [
                     ListTile(
                       leading: const Icon(Icons.verified, color: Colors.orange),
                       title: const Text('My Certificates'),
                       trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                       onTap: () => context.push('/certificates'),
                     ),
                     const Divider(height: 1),
                     ListTile(
                      leading: const Icon(Icons.upload_file, color: Colors.blue),
                      title: const Text('Upload Resource'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () => context.push('/resources/upload'),
                    ),
                     const Divider(height: 1),
                     ListTile(
                       leading: const Icon(Icons.settings, color: Colors.grey),
                       title: const Text('Settings'),
                       trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                       onTap: () {},
                     ),
                   ],
                 ),
               ),
               const SizedBox(height: 24),
               AppButton(
                 label: 'Logout',
                 icon: Icons.logout,
                 onPressed: () async {
                   await ref.read(authRepositoryProvider).logout();
                   context.go('/login');
                 },
                 type: AppButtonType.outline, // Using Outline for logout usually
                 fullWidth: true,
               ),
             ],
           ),
         ),
       ),
    );
  }
}
