import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/splash_screen.dart';
import '../features/auth/onboarding_screen.dart';
import '../features/auth/forgot_password_screen.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/courses/courses_screen.dart';
import '../features/courses/course_details_screen.dart';
import '../features/courses/add_course_screen.dart';
import '../features/courses/edit_course_screen.dart';
import '../features/assignments/assignments_screen.dart';
import '../features/assignments/assignment_detail_screen.dart';
import '../features/assignments/submission_detail_screen.dart';
import '../features/ai/ai_helper_screen.dart';
import '../features/messages/conversation_screen.dart';
import '../features/messages/chat_screen.dart';
import '../features/messages/course_chat_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/profile/teacher_management_screen.dart';
import '../features/certificates/certificate_screens.dart';
import '../features/resources/resource_upload_screen.dart';
import '../features/resources/resource_list_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/reminders/reminder_screen.dart';
import '../features/assignments/add_assignment_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (context, state) => const OnboardingScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/forgot-password', builder: (context, state) => const ForgotPasswordScreen()),
      GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
      
      // Courses
      GoRoute(path: '/courses', builder: (context, state) => const CoursesScreen()),
      GoRoute(path: '/courses/add', builder: (context, state) => const AddCourseScreen()),
      GoRoute(path: '/courses/:id', builder: (context, state) => CourseDetailScreen(courseId: state.pathParameters['id']!)),
      GoRoute(path: '/courses/edit/:id', builder: (context, state) => EditCourseScreen(courseId: state.pathParameters['id']!)),
      GoRoute(path: '/courses/:id/chat', builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        return CourseChatScreen(
          courseId: extra?['courseId'] ?? state.pathParameters['id']!,
          courseTitle: extra?['courseTitle'] ?? 'Course Chat',
        );
      }),
      GoRoute(path: '/courses/:id/assignments', builder: (context, state) => AssignmentsScreen(courseId: state.pathParameters['id']!)),
      GoRoute(path: '/courses/:id/assignments/add', builder: (context, state) => AddAssignmentScreen(courseId: state.pathParameters['id']!)),
      
      // Assignments
      GoRoute(path: '/assignments/:id', builder: (context, state) => AssignmentDetailScreen(assignmentId: state.pathParameters['id']!)),
      GoRoute(path: '/submissions/:id', builder: (context, state) => SubmissionDetailScreen(submissionId: state.pathParameters['id']!)),

      // AI
      GoRoute(path: '/ai-helper', builder: (context, state) => const AiHelperScreen()),
      
      // Messages
      GoRoute(path: '/chat', builder: (context, state) => const ConversationScreen()),
      GoRoute(path: '/chat/:id', builder: (context, state) => ChatScreen(conversationId: state.pathParameters['id']!)),
      
      // Certificates
      GoRoute(path: '/certificates', builder: (context, state) => const CertificateListScreen()),
      GoRoute(path: '/certificates/issue', builder: (context, state) => const IssueCertificateScreen()),
      GoRoute(path: '/certificates/verify', builder: (context, state) => const VerifierScreen()),
      GoRoute(path: '/certificates/:id', builder: (context, state) => CertificateDetailScreen(certificateId: state.pathParameters['id']!)),

      // Reminders
      GoRoute(path: '/reminders', builder: (context, state) => const ReminderScreen()),

      // Resources
      GoRoute(path: '/resources', builder: (context, state) => const ResourceListScreen()),
      GoRoute(path: '/resources/upload', builder: (context, state) => const ResourceUploadScreen()),

      // Notifications
      GoRoute(path: '/notifications', builder: (context, state) => const NotificationsScreen()),
      
      // Profile & Admin
      GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      GoRoute(path: '/teacher-management', builder: (context, state) => const TeacherManagementScreen()),
    ],
  );
});
