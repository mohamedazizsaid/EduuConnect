import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/empty_state.dart';
import '../../data/repositories/user_repository.dart';

// REPOSITORIES (Simulated inline for brevity)
final certificatesProvider = FutureProvider<List<Certificate>>((ref) async {
  final dio = ref.watch(dioProvider);
  try {
    final response = await dio.get('/certificates');
    final List<dynamic> data = response.data as List;
    return data.map((json) => Certificate.fromJson(json)).toList();
  } catch (e) {
    print('Error fetching certificates: $e');
    return [];
  }
});

class CertificateListScreen extends ConsumerWidget {
  const CertificateListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final certsAsync = ref.watch(certificatesProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('My Certificates')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/certificates/issue'),
        child: const Icon(Icons.add),
      ),
      child: certsAsync.when(
        data: (certs) {
          if (certs.isEmpty) {
            return const EmptyStateWidget(
              title: 'No certificates yet',
              subtitle: 'Complete courses to earn certificates.',
              icon: Icons.workspace_premium_outlined,
            );
          }
          return ListView.builder(
            itemCount: certs.length,
            itemBuilder: (context, index) {
              final cert = certs[index];
              return CustomCard(
                child: ListTile(
                  leading: const Icon(Icons.workspace_premium, color: Colors.amber, size: 40),
                  title: Text('Certificate #${cert.id.substring(0, 8)}'),
                  subtitle: Text('Issued: ${cert.issueDate}'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                     // Navigate to details
                  },
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}

final usersProvider = FutureProvider<List<User>>((ref) async {
  return ref.watch(userRepositoryProvider).getUsers();
});

final allCoursesProvider = FutureProvider<List<Course>>((ref) async {
  // Assuming CourseRepository is available and has getCourses
  // If not, we can use Dio directly or import the existing provider if accessible
  // For now, using Dio directly to ensure it works independently
  final dio = ref.watch(dioProvider);
  final response = await dio.get(ApiConstants.courses);
  final List<dynamic> data = response.data as List;
  return data.map((json) => Course.fromJson(json)).toList();
});

class IssueCertificateScreen extends ConsumerStatefulWidget {
  const IssueCertificateScreen({super.key});

  @override
  ConsumerState<IssueCertificateScreen> createState() => _IssueCertificateScreenState();
}

class _IssueCertificateScreenState extends ConsumerState<IssueCertificateScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedStudentId;
  String? _selectedCourseId;
  bool _isLoading = false;
  
  Future<void> _issue() async {
     if (!_formKey.currentState!.validate()) return;
     setState(() => _isLoading = true);
     try {
       final dio = ref.read(dioProvider);
       await dio.post(ApiConstants.certificatesIssue, data: {
         'userId': _selectedStudentId,
         'courseId': _selectedCourseId,
       });
       if(mounted) {
         ref.invalidate(certificatesProvider);
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Certificate Issued Successfully!')));
         Navigator.pop(context); // Go back after success
       }
     } catch (e) {
       if(mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
     } finally {
       if(mounted) setState(() => _isLoading = false);
     }
  }

  @override
  Widget build(BuildContext context) {
    final usersAsync = ref.watch(usersProvider);
    final coursesAsync = ref.watch(allCoursesProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Issue Certificate')),
      child: CustomCard(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Select Student', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                usersAsync.when(
                  data: (users) {
                    final students = users.where((u) => u.role == 'STUDENT').toList();
                    return DropdownButtonFormField<String>(
                      value: _selectedStudentId,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: students.map((user) {
                        return DropdownMenuItem(
                          value: user.id,
                          child: Text('${user.name} (${user.email})', overflow: TextOverflow.ellipsis),
                        );
                      }).toList(),
                      onChanged: (value) => setState(() => _selectedStudentId = value),
                      validator: (value) => value == null ? 'Please select a student' : null,
                      isExpanded: true,
                    );
                  },
                  loading: () => const LinearProgressIndicator(),
                  error: (err, _) => Text('Error loading students: $err', style: const TextStyle(color: Colors.red)),
                ),
                const SizedBox(height: 24),
                const Text('Select Course', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                coursesAsync.when(
                  data: (courses) {
                    return DropdownButtonFormField<String>(
                      value: _selectedCourseId,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.book),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: courses.map((course) {
                        return DropdownMenuItem(
                          value: course.id,
                          child: Text(course.title, overflow: TextOverflow.ellipsis),
                        );
                      }).toList(),
                      onChanged: (value) => setState(() => _selectedCourseId = value),
                      validator: (value) => value == null ? 'Please select a course' : null,
                      isExpanded: true,
                    );
                  },
                  loading: () => const LinearProgressIndicator(),
                  error: (err, _) => Text('Error loading courses: $err', style: const TextStyle(color: Colors.red)),
                ),
                const SizedBox(height: 32),
                AppButton(
                  label: 'Issue Certificate',
                  onPressed: _issue,
                  isLoading: _isLoading,
                  isFullWidth: true,
                  icon: Icons.verified_user,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class VerifierScreen extends ConsumerStatefulWidget {
  const VerifierScreen({super.key});

  @override
  ConsumerState<VerifierScreen> createState() => _VerifierScreenState();
}

class _VerifierScreenState extends ConsumerState<VerifierScreen> {
  final _idController = TextEditingController();
  String _result = '';
  bool _isLoading = false;

  Future<void> _verify() async {
    setState(() => _isLoading = true);
    try {
      final dio = ref.read(dioProvider);
      final res = await dio.get('${ApiConstants.certificatesVerify}/${_idController.text}');
      setState(() => _result = 'Valid: ${res.data['isValid']}');
    } catch (e) {
      setState(() => _result = 'Invalid or Error');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      appBar: AppBar(title: const Text('Verify Certificate')),
      child: Column(
        children: [
          CustomCard(
            child: Column(
              children: [
                 TextFormField(
                   controller: _idController, 
                   decoration: const InputDecoration(
                     labelText: 'Certificate ID',
                     suffixIcon: Icon(Icons.qr_code),
                   ),
                  ),
                 const SizedBox(height: 24),
                 AppButton(
                   label: 'Verify',
                   onPressed: _verify,
                   isLoading: _isLoading,
                   isFullWidth: true,
                   icon: Icons.verified_user,
                 ),
              ],
            ),
          ),
           if (_result.isNotEmpty) ...[
             const SizedBox(height: 24),
             CustomCard(
               color: _result.contains('Valid: true') ? Colors.green[50] : Colors.red[50],
               child: Row(
                 children: [
                   Icon(
                     _result.contains('Valid: true') ? Icons.check_circle : Icons.error,
                     color: _result.contains('Valid: true') ? Colors.green : Colors.red,
                   ),
                   const SizedBox(width: 16),
                   Text(
                     _result, 
                     style: TextStyle(
                       fontWeight: FontWeight.bold,
                       color: _result.contains('Valid: true') ? Colors.green[800] : Colors.red[800],
                     )
                   ),
                 ],
               ),
             ),
           ]
        ],
      ),
    );
  }
}

class CertificateDetailScreen extends ConsumerWidget {
  final String certificateId;
  const CertificateDetailScreen({super.key, required this.certificateId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ScreenWrapper(
      appBar: AppBar(title: const Text('Certificate Details')),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.amber, width: 8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 10),
              )
            ]
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.workspace_premium, size: 80, color: Colors.amber),
              const SizedBox(height: 16),
              Text(
                'Certificate of Completion',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontFamily: 'Serif', fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              const Text('This certifies that ... has completed the course', textAlign: TextAlign.center),
              const SizedBox(height: 16),
              Text('ID: $certificateId', style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock, size: 16, color: Colors.green),
                  SizedBox(width: 4),
                  Text('Secured by Blockchain', style: TextStyle(color: Colors.green, fontSize: 12)),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
