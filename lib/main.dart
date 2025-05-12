import 'package:flutter/material.dart';
import 'screens/start_screen.dart';
import 'screens/login_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/verification_screen.dart';
import 'screens/set_new_password_screen.dart';
import 'screens/face_verification.dart';

void main() {
  runApp(const TimeTripApp());
}

class TimeTripApp extends StatelessWidget {
  const TimeTripApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Time Trip',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: const StartScreen(), // 🟢 Start here
      routes: {
        '/login': (context) => const LoginScreen(),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/verification') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => VerificationScreen(email: args['email']),
          );
        } else if (settings.name == '/set-password') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => SetNewPasswordScreen(email: args['email']),
          );
        }
        return null;
      },
    );
  }
}
