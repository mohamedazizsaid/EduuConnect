import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/models/app_models.dart';

final currentUserProvider = FutureProvider<User?>((ref) async {
  return ref.watch(authRepositoryProvider).getUser();
});
