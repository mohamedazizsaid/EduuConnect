import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/auth_repository.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../widgets/app_card.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

import 'dashboard_provider.dart'; // Import the provider

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statsAsync = ref.watch(dashboardStatsProvider); // Watch stats
    
    return ScreenWrapper(
      appBar: AppBar(
        title: Text('EduConnect', style: AppTypography.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary)),
        leading: Builder(
          builder: (context) => IconButton(
             icon: const Icon(Icons.menu),
             onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.grey600),
            onPressed: () {
               ref.read(authRepositoryProvider).logout();
               context.go('/login');
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
               decoration: const BoxDecoration(color: AppColors.primary),
               child: Column(
                 crossAxisAlignment: CrossAxisAlignment.start,
                 mainAxisAlignment: MainAxisAlignment.end,
                 children: [
                   const Icon(Icons.school, size: 48, color: Colors.white),
                   const SizedBox(height: 16),
                   Text('EduConnect', style: AppTypography.textTheme.headlineSmall?.copyWith(color: Colors.white)),
                 ],
               ),
            ),
            _buildDrawerItem(Icons.dashboard_outlined, 'Dashboard', () { Navigator.pop(context); context.go('/dashboard'); }),
            _buildDrawerItem(Icons.class_outlined, 'Courses', () { Navigator.pop(context); context.push('/courses'); }),
            _buildDrawerItem(Icons.notifications_outlined, 'Notifications', () { Navigator.pop(context); context.push('/notifications'); }),
            _buildDrawerItem(Icons.create_new_folder_outlined, 'Resources', () { Navigator.pop(context); context.push('/resources'); }),
            _buildDrawerItem(Icons.admin_panel_settings_outlined, 'Teacher Management', () { Navigator.pop(context); context.push('/teacher-management'); }),
            _buildDrawerItem(Icons.workspace_premium_outlined, 'Certificates', () { Navigator.pop(context); context.push('/certificates'); }),
            _buildDrawerItem(Icons.alarm, 'Reminders', () { Navigator.pop(context); context.push('/reminders'); }),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
          if (index == 1) context.push('/courses');
          if (index == 2) context.push('/chat');
          if (index == 3) context.push('/profile');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.book), label: 'Courses'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
      child: RefreshIndicator(
        onRefresh: () => ref.refresh(dashboardStatsProvider.future),
        child: SingleChildScrollView(
           physics: const AlwaysScrollableScrollPhysics(),
           child: Column(
             crossAxisAlignment: CrossAxisAlignment.start,
             children: [
               Text('Welcome back!', style: AppTypography.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
               Text('Here is what\'s happening today.', style: AppTypography.textTheme.bodyLarge?.copyWith(color: AppColors.grey600)),
               const SizedBox(height: 24),
               
               // Stats Row
               statsAsync.when(
                 data: (stats) => Column(
                   children: [
                     Row(
                       children: [
                         Expanded(child: _buildStatCard(context, 'Active Courses', stats.activeCourses.toString(), Colors.blue, Icons.book)),
                         const SizedBox(width: 16),
                         Expanded(child: _buildStatCard(context, 'Assignments', stats.assignments.toString(), Colors.orange, Icons.assignment)),
                       ],
                     ),
                     const SizedBox(height: 16),
                     Row(
                       children: [
                         Expanded(child: _buildStatCard(context, 'Certificates', stats.certificates.toString(), Colors.green, Icons.workspace_premium)),
                         const SizedBox(width: 16)                       ],
                     ),
                   ],
                 ),
                 loading: () => const Center(child: CircularProgressIndicator()),
                 error: (err, stack) => Text('Error loading stats: $err', style: TextStyle(color: AppColors.error)),
               ),
  
               const SizedBox(height: 32),
               Text('Recent Activity', style: AppTypography.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
               const SizedBox(height: 16),
               AppCard(
                 child: ListTile(
                     contentPadding: EdgeInsets.zero,
                     leading: CircleAvatar(backgroundColor: AppColors.success.withOpacity(0.1), child: const Icon(Icons.check, color: AppColors.success)),
                     title: Text('Completed "Intro to AI"', style: AppTypography.textTheme.titleMedium),
                     subtitle: Text('2 hours ago', style: AppTypography.textTheme.bodySmall),
                 ),
               ),
               const SizedBox(height: 12),
               AppCard(
                 child: ListTile(
                     contentPadding: EdgeInsets.zero,
                     leading: CircleAvatar(backgroundColor: AppColors.info.withOpacity(0.1), child: const Icon(Icons.upload_file, color: AppColors.info)),
                     title: Text('Submitted Assignment', style: AppTypography.textTheme.titleMedium),
                     subtitle: Text('5 hours ago', style: AppTypography.textTheme.bodySmall),
                 ),
               ),
             ],
           ),
         ),
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.grey700),
      title: Text(title, style: AppTypography.textTheme.bodyLarge),
      onTap: onTap,
    );
  }

  Widget _buildStatCard(BuildContext context, String title, String count, Color color, IconData icon) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 16),
          Text(count, style: AppTypography.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          Text(title, style: AppTypography.textTheme.bodyMedium?.copyWith(color: AppColors.grey600)),
        ],
      ),
    );
  }
}
