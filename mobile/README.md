# EduConnect Mobile (Flutter)

Mobile application for EduConnect built with Flutter.

## Prerequisites
- Flutter SDK (v3.0+)
- Android Studio / VS Code with Flutter extensions
- Chrome (for web) or Emulator (for mobile)

## Installation

```bash
cd mobile
flutter pub get
```

## Running Locally

To run on Chrome (Web):

```bash
flutter run -d chrome --no-pub
```

To run on Android Emulator:

```bash
flutter run
```

## Configuration
Ensure `api_constants.dart` points to your backend instance (default `http://localhost:3000`).
