class ApiConstants {
  static const String baseUrl = 'http://localhost:3000/api/v1'; // Android Emulator might need 10.0.2.2 - User provided 3000, assuming web or local win.
  // Using localhost for Windows. For Android Emulator use 10.0.2.2.
  
  // Auth
  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';
  static const String authMe = '/auth/me';
  static const String authLogout = '/auth/logout';
  
  // Courses
  static const String courses = '/courses';
  
  // Assignments
  static const String assignments = '/assignments';
  static const String submissions = '/submissions';
  
  // AI
  static const String aiRecommend = '/ai/recommendations';
  static const String aiEvaluate = '/ai/evaluate';
  
  // Certificates
  static const String certificatesIssue = '/certificates/issue';
  static const String certificatesVerify = '/certificates/verify';
  
  // Messages
  static const String conversations = '/conversations';
  
  // Resources
  static const String resources = '/resources';
  
  // Notifications
  static const String notifications = '/notifications';
  static const String reminders = '/reminders';
  
  // Users
  static const String users = '/users';
}
