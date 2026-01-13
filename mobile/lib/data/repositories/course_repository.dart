import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/api_constants.dart';
import '../../core/utils/dio_provider.dart';
import '../models/app_models.dart';

final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  return CourseRepository(ref.watch(dioProvider));
});

class CourseRepository {
  final Dio _dio;

  CourseRepository(this._dio);

  Future<List<Course>> getCourses() async {
    final response = await _dio.get(ApiConstants.courses);
    return (response.data as List).map((e) => Course.fromJson(e)).toList();
  }

  Future<Course> getCourse(String id) async {
    final response = await _dio.get('${ApiConstants.courses}/$id');
    return Course.fromJson(response.data);
  }

  Future<Course> createCourse(Map<String, dynamic> courseData) async {
    final response = await _dio.post(ApiConstants.courses, data: courseData);
    return Course.fromJson(response.data);
  }

  Future<Course> updateCourse(String id, Map<String, dynamic> courseData) async {
    final response = await _dio.patch('${ApiConstants.courses}/$id', data: courseData);
    return Course.fromJson(response.data);
  }

  Future<void> deleteCourse(String id) async {
    await _dio.delete('${ApiConstants.courses}/$id');
  }
  
  // Add other methods like enroll, etc.
}
