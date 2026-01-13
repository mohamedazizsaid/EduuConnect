import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/repositories/course_repository.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';
import 'courses_screen.dart'; // Import to access coursesProvider

class AddCourseScreen extends ConsumerStatefulWidget {
  const AddCourseScreen({super.key});

  @override
  ConsumerState<AddCourseScreen> createState() => _AddCourseScreenState();
}

class _AddCourseScreenState extends ConsumerState<AddCourseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  String _category = 'Programming';
  String _level = 'Beginner';
  bool _isLoading = false;

  final List<String> _categories = ['Programming', 'Math', 'Science', 'Art'];
  final List<String> _levels = ['Beginner', 'Intermediate', 'Advanced'];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      await ref.read(courseRepositoryProvider).createCourse({
        'title': _titleController.text,
        'description': _descriptionController.text,
        'category': _category,
        'difficultyLevel': _level,
        'price': _priceController.text.isNotEmpty ? double.tryParse(_priceController.text) : 0,
        // 'thumbnail': 'https://via.placeholder.com/300' // Optional default thumbnail
      });
      
      // Refresh the list
      ref.invalidate(coursesProvider);
      
      if (mounted) {
        context.pop(); 
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
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text('Add Course')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              AppTextField(
                label: 'Title',
                controller: _titleController,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              AppTextField(
                label: 'Description',
                controller: _descriptionController,
                maxLines: 3,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              AppTextField(
                label: 'Price',
                controller: _priceController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                hint: '0.00 (Leave empty for free)',
              ),
              const SizedBox(height: 16),
              _buildDropdown('Category', _category, _categories, (v) => setState(() => _category = v!)),
              const SizedBox(height: 16),
              _buildDropdown('Level', _level, _levels, (v) => setState(() => _level = v!)),
              const SizedBox(height: 32),
              AppButton(
                label: 'Create Course',
                onPressed: _submit,
                isLoading: _isLoading,
                fullWidth: true,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: value,
          items: items.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
          onChanged: onChanged,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey[100],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
