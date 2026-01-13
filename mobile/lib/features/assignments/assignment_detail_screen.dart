import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';
// For user/token if needed
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';

final assignmentProvider = FutureProvider.family<Assignment, String>((ref, id) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('${ApiConstants.assignments}/$id'); // Assuming route exists or use course route
  // The backend mapping says GET /assignments/:id
  return Assignment.fromJson(response.data);
});

class AssignmentDetailScreen extends ConsumerStatefulWidget {
  final String assignmentId;
  const AssignmentDetailScreen({super.key, required this.assignmentId});

  @override
  ConsumerState<AssignmentDetailScreen> createState() => _AssignmentDetailScreenState();
}

class _AssignmentDetailScreenState extends ConsumerState<AssignmentDetailScreen> {
  bool _isSubmitting = false;

  Future<void> _pickAndSubmit() async {
    final result = await FilePicker.platform.pickFiles();
    if (result == null) return;

    final file = result.files.single;
    // For web/mobile, handling file path vs bytes differs.
    // Assuming simple multipart upload.
    
    setState(() => _isSubmitting = true);
    
    try {
      final dio = ref.read(dioProvider);
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(file.path!, filename: file.name),
      });

      await dio.post('${ApiConstants.assignments}/${widget.assignmentId}/submissions', data: formData);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Submission Successful')));
      }
    } catch (e) {
       if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final assignmentAsync = ref.watch(assignmentProvider(widget.assignmentId));

    return Scaffold(
      appBar: AppBar(title: const Text('Assignment Details')),
      body: assignmentAsync.when(
        data: (assignment) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(assignment.title, style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 8),
              Text('Due: ${assignment.dueDate}'),
              const SizedBox(height: 16),
              Text(assignment.description),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isSubmitting ? null : _pickAndSubmit,
                  icon: const Icon(Icons.upload_file),
                  label: _isSubmitting ? const Text('Uploading...') : const Text('Submit Assignment'),
                ),
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
