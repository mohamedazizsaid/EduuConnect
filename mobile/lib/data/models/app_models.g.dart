// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      profilePicture: json['profilePicture'] as String?,
    );

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'role': instance.role,
      'profilePicture': instance.profilePicture,
    };

_$CourseImpl _$$CourseImplFromJson(Map<String, dynamic> json) => _$CourseImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      category: json['category'] as String? ?? 'General',
      difficultyLevel: json['difficultyLevel'] as String? ?? 'Beginner',
      thumbnail: json['thumbnail'] as String?,
      teacher: json['instructorId'] as String?,
      students: (json['students'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      resources: (json['resources'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      price: (json['price'] as num?)?.toDouble(),
      isPublished: json['isPublished'] as bool? ?? false,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$CourseImplToJson(_$CourseImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'category': instance.category,
      'difficultyLevel': instance.difficultyLevel,
      'thumbnail': instance.thumbnail,
      'instructorId': instance.teacher,
      'students': instance.students,
      'resources': instance.resources,
      'price': instance.price,
      'isPublished': instance.isPublished,
      'createdAt': instance.createdAt?.toIso8601String(),
    };

_$AssignmentImpl _$$AssignmentImplFromJson(Map<String, dynamic> json) =>
    _$AssignmentImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      dueDate: json['dueDate'] == null
          ? null
          : DateTime.parse(json['dueDate'] as String),
      courseId: json['courseId'] as String?,
    );

Map<String, dynamic> _$$AssignmentImplToJson(_$AssignmentImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'dueDate': instance.dueDate?.toIso8601String(),
      'courseId': instance.courseId,
    };

_$SubmissionImpl _$$SubmissionImplFromJson(Map<String, dynamic> json) =>
    _$SubmissionImpl(
      id: json['id'] as String,
      studentId: json['studentId'] as String,
      assignmentId: json['assignmentId'] as String,
      fileUrl: json['fileUrl'] as String?,
      grade: json['grade'] as String?,
      feedback: json['feedback'] as String?,
      submittedAt: json['submittedAt'] == null
          ? null
          : DateTime.parse(json['submittedAt'] as String),
    );

Map<String, dynamic> _$$SubmissionImplToJson(_$SubmissionImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'studentId': instance.studentId,
      'assignmentId': instance.assignmentId,
      'fileUrl': instance.fileUrl,
      'grade': instance.grade,
      'feedback': instance.feedback,
      'submittedAt': instance.submittedAt?.toIso8601String(),
    };

_$ChatMessageImpl _$$ChatMessageImplFromJson(Map<String, dynamic> json) =>
    _$ChatMessageImpl(
      id: json['id'] as String,
      senderId: json['senderId'] as String,
      conversationId: json['conversationId'] as String,
      content: json['content'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$ChatMessageImplToJson(_$ChatMessageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'senderId': instance.senderId,
      'conversationId': instance.conversationId,
      'content': instance.content,
      'createdAt': instance.createdAt?.toIso8601String(),
    };

_$ConversationImpl _$$ConversationImplFromJson(Map<String, dynamic> json) =>
    _$ConversationImpl(
      id: json['id'] as String,
      participants: (json['participants'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      lastMessage: json['lastMessage'] as String?,
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ConversationImplToJson(_$ConversationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'participants': instance.participants,
      'lastMessage': instance.lastMessage,
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

_$AppNotificationImpl _$$AppNotificationImplFromJson(
        Map<String, dynamic> json) =>
    _$AppNotificationImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      isRead: json['isRead'] as bool? ?? false,
      type: json['type'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$AppNotificationImplToJson(
        _$AppNotificationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'message': instance.message,
      'isRead': instance.isRead,
      'type': instance.type,
      'createdAt': instance.createdAt?.toIso8601String(),
    };

_$CertificateImpl _$$CertificateImplFromJson(Map<String, dynamic> json) =>
    _$CertificateImpl(
      id: json['id'] as String,
      studentId: json['userId'] as String?,
      courseId: json['courseId'] as String?,
      issueDate: json['issuedAt'] as String?,
      certificateHash: json['hash'] as String?,
      transactionId: json['txHash'] as String?,
      uniqueId: json['uniqueId'] as String?,
      status: json['status'] as String?,
      blockNumber: (json['blockNumber'] as num?)?.toInt(),
      isValid: json['isValid'] as bool? ?? true,
    );

Map<String, dynamic> _$$CertificateImplToJson(_$CertificateImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.studentId,
      'courseId': instance.courseId,
      'issuedAt': instance.issueDate,
      'hash': instance.certificateHash,
      'txHash': instance.transactionId,
      'uniqueId': instance.uniqueId,
      'status': instance.status,
      'blockNumber': instance.blockNumber,
      'isValid': instance.isValid,
    };

_$AuthResponseImpl _$$AuthResponseImplFromJson(Map<String, dynamic> json) =>
    _$AuthResponseImpl(
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      token: json['accessToken'] as String,
    );

Map<String, dynamic> _$$AuthResponseImplToJson(_$AuthResponseImpl instance) =>
    <String, dynamic>{
      'user': instance.user,
      'accessToken': instance.token,
    };
