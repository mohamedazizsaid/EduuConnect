import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';

// Assuming GET /submissions/:id exists or we parse generic
final submissionProvider = FutureProvider.family<Submission, String>((ref, id) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('${ApiConstants.submissions}/$id');
  return Submission.fromJson(response.data);
});

class SubmissionDetailScreen extends ConsumerStatefulWidget {
  final String submissionId;
  const SubmissionDetailScreen({super.key, required this.submissionId});

  @override
  ConsumerState<SubmissionDetailScreen> createState() => _SubmissionDetailScreenState();
}

class _SubmissionDetailScreenState extends ConsumerState<SubmissionDetailScreen> {
  final _gradeController = TextEditingController();
  final _feedbackController = TextEditingController();

  Future<void> _gradeSubmission() async {
      try {
          final dio = ref.read(dioProvider);
          await dio.patch('${ApiConstants.submissions}/${widget.submissionId}', data: {
              'grade': _gradeController.text,
              'feedback': _feedbackController.text,
          });
          ref.refresh(submissionProvider(widget.submissionId));
      } catch (e) {
         // handle error
      }
  }

  @override
  Widget build(BuildContext context) {
    final subAsync = ref.watch(submissionProvider(widget.submissionId));

    return Scaffold(
      appBar: AppBar(title: const Text('Submission Details')),
      body: subAsync.when(
        data: (submission) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               Text('File: ${submission.fileUrl ?? "No File"}'),
               Text('Submitted: ${submission.submittedAt}'),
               const Divider(),
               if (submission.grade != null) ...[
                   Text('Grade: ${submission.grade}', style: const TextStyle(fontWeight: FontWeight.bold)),
                   Text('Feedback: ${submission.feedback}'),
               ] else ...[
                   const Text('Grade this submission:'),
                   TextField(controller: _gradeController, decoration: const InputDecoration(labelText: 'Grade')),
                   TextField(controller: _feedbackController, decoration: const InputDecoration(labelText: 'Feedback')),
                   ElevatedButton(onPressed: _gradeSubmission, child: const Text('Submit Grade')),
               ]
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('$err')),
      ),
    );
  }
}
