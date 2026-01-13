import 'package:freezed_annotation/freezed_annotation.dart';

part 'app_models.freezed.dart';
part 'app_models.g.dart';

@freezed
class User with _$User {
  const factory User({
    @JsonKey(name: 'id') required String id,
    required String name,
    required String email,
    required String role, // 'student', 'teacher', 'admin'
    String? profilePicture,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

@freezed
class Course with _$Course {
  const factory Course({
    @JsonKey(name: 'id') required String id,
    required String title,
    required String description,
    @Default('General') String category,
    @Default('Beginner') String difficultyLevel, // 'Beginner', 'Intermediate', 'Advanced'
    String? thumbnail,
    @JsonKey(name: 'instructorId') String? teacher, // Mapped from instructorId
    List<String>? students,
    List<String>? resources,
    double? price,
    @Default(false) bool isPublished,
    DateTime? createdAt,
  }) = _Course;

  factory Course.fromJson(Map<String, dynamic> json) => _$CourseFromJson(json);
}

@freezed
class Assignment with _$Assignment {
  const factory Assignment({
    @JsonKey(name: 'id') required String id,
    required String title,
    required String description,
    DateTime? dueDate,
    String? courseId,
  }) = _Assignment;

  factory Assignment.fromJson(Map<String, dynamic> json) => _$AssignmentFromJson(json);
}

@freezed
class Submission with _$Submission {
  const factory Submission({
    @JsonKey(name: 'id') required String id,
    required String studentId,
    required String assignmentId,
    String? fileUrl, // or content
    String? grade,
    String? feedback,
    DateTime? submittedAt,
  }) = _Submission;

  factory Submission.fromJson(Map<String, dynamic> json) => _$SubmissionFromJson(json);
}

@freezed
class ChatMessage with _$ChatMessage {
  const factory ChatMessage({
    @JsonKey(name: 'id') required String id,
    required String senderId,
    required String conversationId,
    required String content,
    DateTime? createdAt,
  }) = _ChatMessage;

  factory ChatMessage.fromJson(Map<String, dynamic> json) => _$ChatMessageFromJson(json);
}

@freezed
class Conversation with _$Conversation {
  const factory Conversation({
    @JsonKey(name: 'id') required String id,
    List<String>? participants,
    String? lastMessage,
    DateTime? updatedAt,
  }) = _Conversation;
   factory Conversation.fromJson(Map<String, dynamic> json) => _$ConversationFromJson(json);
}


@freezed
class AppNotification with _$AppNotification { // 'Notification' conflict with Flutter
  const factory AppNotification({
    @JsonKey(name: 'id') required String id,
    required String userId,
    required String title,
    required String message,
    @Default(false) bool isRead,
    String? type,
    DateTime? createdAt,
  }) = _AppNotification;

  factory AppNotification.fromJson(Map<String, dynamic> json) => _$AppNotificationFromJson(json);
}

@freezed
class Certificate with _$Certificate {
  const factory Certificate({
    @JsonKey(name: 'id') required String id,
    @JsonKey(name: 'userId') String? studentId, // Backend sends userId, we map it to studentId
    String? courseId,
    @JsonKey(name: 'issuedAt') String? issueDate, // Backend sends issuedAt
    @JsonKey(name: 'hash') String? certificateHash, // Blockchain hash
    @JsonKey(name: 'txHash') String? transactionId,
    String? uniqueId,
    String? status,
    int? blockNumber,
    @Default(true) bool isValid,
  }) = _Certificate;

  factory Certificate.fromJson(Map<String, dynamic> json) => _$CertificateFromJson(json);
}

@freezed
class AuthResponse with _$AuthResponse {
  const factory AuthResponse({
    required User user,
    @JsonKey(name: 'accessToken') required String token,
  }) = _AuthResponse;

  factory AuthResponse.fromJson(Map<String, dynamic> json) => _$AuthResponseFromJson(json);
}
