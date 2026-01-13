import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/dio_provider.dart';
import '../../core/constants/api_constants.dart';
import '../models/app_models.dart';

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository(ref.watch(dioProvider));
});

class UserRepository {
  final Dio _dio;

  UserRepository(this._dio);

  Future<List<User>> getUsers() async {
    try {
      final response = await _dio.get(ApiConstants.users);
      final List<dynamic> data = response.data as List;
      return data.map((json) => User.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch users: $e');
    }
  }
}
