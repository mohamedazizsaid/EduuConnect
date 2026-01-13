import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/custom_card.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/empty_state.dart';

// --- Model ---
class Reminder {
  final String id;
  final String title;
  final DateTime dateTime;
  final bool isCompleted;

  Reminder({
    required this.id,
    required this.title,
    required this.dateTime,
    this.isCompleted = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'dateTime': dateTime.toIso8601String(),
    'isCompleted': isCompleted,
  };

  factory Reminder.fromJson(Map<String, dynamic> json) => Reminder(
    id: json['id'],
    title: json['title'],
    dateTime: DateTime.parse(json['dateTime']),
    isCompleted: json['isCompleted'] ?? false,
  );
  
  Reminder copyWith({bool? isCompleted}) {
    return Reminder(
      id: id,
      title: title,
      dateTime: dateTime,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

// --- Repository/Provider ---
final reminderRepositoryProvider = Provider((ref) => ReminderRepository());

final remindersProvider = StateNotifierProvider<ReminderNotifier, List<Reminder>>((ref) {
  return ReminderNotifier(ref.watch(reminderRepositoryProvider));
});

class ReminderRepository {
  static const _key = 'reminders';

  Future<List<Reminder>> loadReminders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? data = prefs.getString(_key);
    if (data == null) return [];
    final List<dynamic> jsonList = jsonDecode(data);
    return jsonList.map((e) => Reminder.fromJson(e)).toList();
  }

  Future<void> saveReminders(List<Reminder> reminders) async {
    final prefs = await SharedPreferences.getInstance();
    final String data = jsonEncode(reminders.map((e) => e.toJson()).toList());
    await prefs.setString(_key, data);
  }
}

class ReminderNotifier extends StateNotifier<List<Reminder>> {
  final ReminderRepository _repository;

  ReminderNotifier(this._repository) : super([]) {
    _load();
  }

  Future<void> _load() async {
    state = await _repository.loadReminders();
  }

  Future<void> addReminder(String title, DateTime dateTime) async {
    final reminder = Reminder(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      dateTime: dateTime,
    );
    state = [...state, reminder];
    await _repository.saveReminders(state);
  }

  Future<void> deleteReminder(String id) async {
    state = state.where((r) => r.id != id).toList();
    await _repository.saveReminders(state);
  }
  
  Future<void> toggleComplete(String id) async {
    state = state.map((r) {
      if (r.id == id) return r.copyWith(isCompleted: !r.isCompleted);
      return r;
    }).toList();
    await _repository.saveReminders(state);
  }
}

// --- Screen ---
class ReminderScreen extends ConsumerStatefulWidget {
  const ReminderScreen({super.key});

  @override
  ConsumerState<ReminderScreen> createState() => _ReminderScreenState();
}

class _ReminderScreenState extends ConsumerState<ReminderScreen> {
  final _titleController = TextEditingController();
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _pickDateTime() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date == null) return;
    
    if (!mounted) return;
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (time == null) return;

    setState(() {
      _selectedDate = date;
      _selectedTime = time;
    });
  }

  void _addReminder() {
    if (_titleController.text.isEmpty || _selectedDate == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    final dateTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    ref.read(remindersProvider.notifier).addReminder(_titleController.text, dateTime);
    
    _titleController.clear();
    setState(() {
      _selectedDate = null;
      _selectedTime = null;
    });
    Navigator.pop(context); // Close bottom sheet
  }

  void _showAddSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 16, right: 16, top: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('New Reminder', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
              autofocus: true,
            ),
            const SizedBox(height: 16),
            InkWell(
              onTap: _pickDateTime,
              child: InputDecorator(
                decoration: const InputDecoration(labelText: 'Date & Time', border: OutlineInputBorder(), prefixIcon: Icon(Icons.access_time)),
                child: Text(
                  _selectedDate != null && _selectedTime != null
                    ? '${DateFormat.yMMMd().format(_selectedDate!)} ${_selectedTime!.format(context)}'
                    : 'Select Date & Time',
                ),
              ),
            ),
            const SizedBox(height: 24),
            AppButton(
              label: 'Add Reminder',
              onPressed: _addReminder,
              isFullWidth: true,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final reminders = ref.watch(remindersProvider);

    return ScreenWrapper(
      appBar: AppBar(title: const Text('Reminders')),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddSheet,
        child: const Icon(Icons.add_alarm),
      ),
      child: reminders.isEmpty
        ? const EmptyStateWidget(
            title: 'No reminders',
            subtitle: 'Add a reminder to stay organized',
            icon: Icons.alarm_off,
          )
        : ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: reminders.length,
            itemBuilder: (context, index) {
              final reminder = reminders[index];
              final isOverdue = reminder.dateTime.isBefore(DateTime.now()) && !reminder.isCompleted;
              
              return Dismissible(
                key: Key(reminder.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  color: Colors.red,
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 20),
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                onDismissed: (_) {
                  ref.read(remindersProvider.notifier).deleteReminder(reminder.id);
                },
                child: CustomCard(
                  child: ListTile(
                    leading: IconButton(
                      icon: Icon(
                        reminder.isCompleted ? Icons.check_circle : Icons.circle_outlined,
                        color: reminder.isCompleted ? Colors.green : (isOverdue ? Colors.red : Colors.grey),
                      ),
                      onPressed: () => ref.read(remindersProvider.notifier).toggleComplete(reminder.id),
                    ),
                    title: Text(
                      reminder.title,
                      style: TextStyle(
                        decoration: reminder.isCompleted ? TextDecoration.lineThrough : null,
                        color: reminder.isCompleted ? Colors.grey : null,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Text(
                      DateFormat.yMMMd().add_jm().format(reminder.dateTime),
                      style: TextStyle(
                        color: isOverdue ? Colors.red : null,
                      ),
                    ),
                    trailing: isOverdue ? const Icon(Icons.warning, color: Colors.red, size: 20) : null,
                  ),
                ),
              );
            },
          ),
    );
  }
}
