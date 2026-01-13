import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/course_repository.dart';
import 'course_details_screen.dart'; // To reuse provider if needed

class EditCourseScreen extends ConsumerStatefulWidget {
  final String courseId;
  const EditCourseScreen({super.key, required this.courseId});

  @override
  ConsumerState<EditCourseScreen> createState() => _EditCourseScreenState();
}

class _EditCourseScreenState extends ConsumerState<EditCourseScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _priceController;
  String? _category;
  String? _level;
  bool _isLoading = false;
  bool _isInit = true;

  final List<String> _categories = ['Programming', 'Math', 'Science', 'Art'];
  final List<String> _levels = ['Beginner', 'Intermediate', 'Advanced'];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descriptionController = TextEditingController();
    _priceController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_isInit) {
      _loadCourse();
      _isInit = false;
    }
  }

  Future<void> _loadCourse() async {
     try {
       final course = await ref.read(courseRepositoryProvider).getCourse(widget.courseId);
       _titleController.text = course.title;
       _descriptionController.text = course.description;
       _priceController.text = course.price?.toString() ?? '0';
       setState(() {
         _category = _categories.contains(course.category) ? course.category : _categories[0];
         _level = _levels.contains(course.difficultyLevel) ? course.difficultyLevel : _levels[0];
       });
     } catch (e) {
       // Handle error
     }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      await ref.read(courseRepositoryProvider).updateCourse(widget.courseId, {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'category': _category,
        'difficultyLevel': _level,
        'price': _priceController.text.isNotEmpty ? double.tryParse(_priceController.text) : 0,
      });
      if (mounted) {
        context.pop(); // Go back
        ref.refresh(courseDetailsProvider(widget.courseId)); // Refresh details
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_category == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      appBar: AppBar(title: const Text('Edit Course')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                maxLines: 3,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(labelText: 'Price'),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _category,
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _category = v!),
                decoration: const InputDecoration(labelText: 'Category'),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _level,
                items: _levels.map((l) => DropdownMenuItem(value: l, child: Text(l))).toList(),
                onChanged: (v) => setState(() => _level = v!),
                decoration: const InputDecoration(labelText: 'Level'),
              ),
              const SizedBox(height: 24),
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _submit,
                      child: const Text('Update Course'),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
