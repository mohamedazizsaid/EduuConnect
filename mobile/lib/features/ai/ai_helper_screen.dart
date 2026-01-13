import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/widgets/screen_wrapper.dart';
import '../../core/widgets/empty_state.dart';

class AiHelperScreen extends ConsumerStatefulWidget {
  const AiHelperScreen({super.key});

  @override
  ConsumerState<AiHelperScreen> createState() => _AiHelperScreenState();
}

class _AiHelperScreenState extends ConsumerState<AiHelperScreen> {
  final List<Message> _messages = []; 
  final _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(Message(text: text, isUser: true));
      _isLoading = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final dio = ref.read(dioProvider);
      final response = await dio.post(ApiConstants.aiRecommend, data: {'query': text});
      
      final reply = response.data['recommendations']?.toString() ?? 'Here are some recommendations...'; 
      
      if (mounted) {
        setState(() {
          _messages.add(Message(text: reply, isUser: false));
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
         setState(() {
          _messages.add(Message(text: 'Error: $e', isUser: false));
        });
        _scrollToBottom();
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      appBar: AppBar(title: const Text('AI Helper')),
      usePadding: false,
      child: Column(
        children: [
          Expanded(
            child: _messages.isEmpty 
              ? const EmptyStateWidget(
                  title: 'Ask AI Assistant',
                  subtitle: 'Get personalized course recommendations and study tips.',
                  icon: Icons.auto_awesome,
                )
              : ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final msg = _messages[index];
                    final isUser = msg.isUser;
                    return Align(
                      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                        decoration: BoxDecoration(
                          color: isUser ? Theme.of(context).primaryColor : Colors.grey[200],
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(16),
                            topRight: const Radius.circular(16),
                            bottomLeft: isUser ? const Radius.circular(16) : Radius.zero,
                            bottomRight: isUser ? Radius.zero : const Radius.circular(16),
                          ),
                        ),
                        child: Text(
                          msg.text,
                          style: TextStyle(
                            color: isUser ? Colors.white : Colors.black87,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    );
                  },
                ),
          ),
          if (_isLoading) 
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: LinearProgressIndicator(
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, -5))
              ]
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    textCapitalization: TextCapitalization.sentences,
                    decoration: InputDecoration(
                      hintText: 'Ask something...',
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: _sendMessage,
                  elevation: 0,
                  child: const Icon(Icons.send_rounded),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Message {
  final String text;
  final bool isUser;
  Message({required this.text, required this.isUser});
}
