import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../data/models/app_models.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/app_button.dart';
import 'resource_list_screen.dart';

class ResourceUploadScreen extends ConsumerStatefulWidget {
  const ResourceUploadScreen({super.key});

  @override
  ConsumerState<ResourceUploadScreen> createState() => _ResourceUploadScreenState();
}

final _coursesProvider = FutureProvider<List<Course>>((ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get(ApiConstants.courses);
  final List<dynamic> data = response.data as List;
  return data.map((json) => Course.fromJson(json)).toList();
});

class _ResourceUploadScreenState extends ConsumerState<ResourceUploadScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _uploading = false;
  String _status = '';
  String? _selectedCourseId;
  PlatformFile? _selectedFile;
  final _titleController = TextEditingController();

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        _selectedFile = result.files.single;
        if (_titleController.text.isEmpty) {
          _titleController.text = _selectedFile!.name;
        }
      });
    }
  }

  Future<void> _upload() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a file')));
      return;
    }

    setState(() {
      _uploading = true;
      _status = 'Uploading...';
    });

    try {
      final dio = ref.read(dioProvider);
      
      final formData = FormData.fromMap({
        'title': _titleController.text,
        'courseId': _selectedCourseId,
        'type': 'FILE',
        // Handle web (bytes) vs native (path)
        'file': _selectedFile!.bytes != null 
            ? MultipartFile.fromBytes(_selectedFile!.bytes!, filename: _selectedFile!.name)
            : await MultipartFile.fromFile(_selectedFile!.path!, filename: _selectedFile!.name),
      });
      
      // Use the new proper upload endpoint
      await dio.post('${ApiConstants.resources}/upload', data: formData);
      
      ref.invalidate(resourcesProvider);

      setState(() {
        _status = 'Upload Complete';
        _selectedFile = null;
        _titleController.clear();
        _selectedCourseId = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Resource uploaded successfully')));
      
    } catch (e) {
       setState(() => _status = 'Error: $e');
    } finally {
      setState(() => _uploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final coursesAsync = ref.watch(_coursesProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Upload Resource')),
      child: CustomCard(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                 coursesAsync.when(
                  data: (courses) {
                    return DropdownButtonFormField<String>(
                      value: _selectedCourseId,
                      decoration: const InputDecoration(
                        labelText: 'Select Course',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.book),
                      ),
                      items: courses.map((course) {
                        return DropdownMenuItem(
                          value: course.id,
                          child: Text(course.title, overflow: TextOverflow.ellipsis),
                        );
                      }).toList(),
                      onChanged: (value) => setState(() => _selectedCourseId = value),
                      validator: (value) => value == null ? 'Please select a course' : null,
                    );
                  },
                  loading: () => const LinearProgressIndicator(),
                  error: (err, _) => Text('Error loading courses: $err'),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
                  validator: (value) => value!.isEmpty ? 'Please enter a title' : null,
                ),
                const SizedBox(height: 16),
                InkWell(
                  onTap: _uploading ? null : _pickFile,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.attach_file),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _selectedFile != null ? _selectedFile!.name : 'Select File to Upload',
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_status.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(_status, style: TextStyle(color: _status.startsWith('Error') ? Colors.red : Colors.green), textAlign: TextAlign.center),
                ],
                const SizedBox(height: 24),
                AppButton(
                  label: 'Upload Resource',
                  onPressed: _uploading ? null : _upload,
                  isLoading: _uploading,
                  isFullWidth: true,
                  icon: Icons.cloud_upload,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
