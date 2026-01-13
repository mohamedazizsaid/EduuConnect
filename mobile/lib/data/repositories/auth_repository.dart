import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/api_constants.dart';
import '../../core/utils/dio_provider.dart';
import '../models/app_models.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider), ref.watch(flutterSecureStorageProvider));
});

class AuthRepository {
  final Dio _dio;
  final FlutterSecureStorage _storage;

  AuthRepository(this._dio, this._storage);

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _dio.post(ApiConstants.authLogin, data: {
        'email': email,
        'password': password,
      });
      // Assuming response.data contains { token: "...", user: {...} } or similar
      // Adjust according to actual backend response structure
      // Based on typical Express auth:
      final data = response.data;
      final authResponse = AuthResponse.fromJson(data);
      
      // Save token
      await _storage.write(key: 'auth_token', value: authResponse.token);
      
      return authResponse;
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthResponse> register(String name, String email, String password, String role) async {
    try {
      final response = await _dio.post(ApiConstants.authRegister, data: {
        'name': name,
        'email': email,
        'password': password,
        'role': role,
      });
      final data = response.data;
      final authResponse = AuthResponse.fromJson(data);
      await _storage.write(key: 'auth_token', value: authResponse.token);
      return authResponse;
    } catch (e) {
      rethrow;
    }
  }

  Future<User?> getUser() async {
    try {
       // Check if token exists first to avoid unnecessary 401
       final token = await _storage.read(key: 'auth_token');
       if (token == null) return null;

      final response = await _dio.get(ApiConstants.authMe);
      // Assuming response.data is the User object or { user: ... }
      // Checks need to be done on actual response
      return User.fromJson(response.data);
    } catch (e) {
      // If 401, clear token
       if (e is DioException && e.response?.statusCode == 401) {
         await _storage.delete(key: 'auth_token');
       }
      return null;
    }
  }

  Future<void> logout() async {
    try {
        await _dio.post(ApiConstants.authLogout);
    } catch (e) {
        // Ignore logout errors
    } finally {
        await _storage.delete(key: 'auth_token');
    }
  }
}
