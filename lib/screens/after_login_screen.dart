import 'dart:math';
import 'package:flutter/material.dart';
import 'face_verification.dart';

class AfterLoginScreen extends StatefulWidget {
  const AfterLoginScreen({Key? key}) : super(key: key);

  @override
  State<AfterLoginScreen> createState() => _AfterLoginScreenState();
}

class _AfterLoginScreenState extends State<AfterLoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _emailOtpController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _phoneOtpController = TextEditingController();

  bool emailOtpSent = false;
  bool emailVerified = false;
  bool phoneOtpSent = false;
  bool phoneVerified = false;

  String emailOtp = "";
  String phoneOtp = "";

  String generateRandomOtp({int length = 4}) {
    final random = Random();
    return List.generate(length, (_) => random.nextInt(10)).join();
  }

  void sendEmailOtp() {
    setState(() {
      emailOtp = generateRandomOtp(length: 4);
      emailOtpSent = true;
      print("Email OTP: $emailOtp");
    });
  }

  void verifyEmailOtp() {
    setState(() {
      emailVerified = true;
    });
  }

  void sendPhoneOtp() {
    setState(() {
      phoneOtp = generateRandomOtp(length: 4);
      phoneOtpSent = true;
      print("Phone OTP: $phoneOtp");
    });
  }

  void verifyPhoneOtp() {
    setState(() {
      phoneVerified = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFD1F3FE), Color(0xFFFFCFE9), Color(0xFFC1BFFE)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStepTitle("Step 1:"),
                _buildCard(
                  isActive: !emailVerified && !phoneVerified,
                  showBorder: emailVerified,
                  child: _buildEmailVerificationContent(),
                ),
                const SizedBox(height: 20),
                _buildStepTitle("Step 2:"),
                _buildCard(
                  isActive: emailVerified && !phoneVerified,
                  showBorder: phoneVerified,
                  color: emailVerified ? const Color(0xFFF5CFEA) : Colors.grey.withOpacity(0.3),
                  child: _buildPhoneVerificationContent(),
                ),
                const SizedBox(height: 20),
                _buildStepTitle("Step 3:"),
                _buildCard(
                  isActive: phoneVerified,
                  showBorder: false,
                  color: phoneVerified ? Colors.white.withOpacity(0.5) : Colors.grey.withOpacity(0.3),
                  child: _buildFaceRecognitionContent(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStepTitle(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        text,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black),
      ),
    );
  }

  Widget _buildEmailVerificationContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        TextField(
          controller: _emailController,
          enabled: !emailVerified,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.black),
          decoration: InputDecoration(
            hintText: 'Enter Email',
            hintStyle: const TextStyle(color: Colors.black45),
            filled: true,
            fillColor: Colors.white.withOpacity(0.3),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
          ),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: !emailVerified ? sendEmailOtp : null,
          style: _buttonStyle(true),
          child: const Text("Send OTP"),
        ),
        const SizedBox(height: 8),
        const Text(
          "OTP will be sent to your email ID. Valid till 10 minutes.",
          style: TextStyle(fontSize: 12, color: Colors.black),
        ),
        const SizedBox(height: 12),
        if (emailOtpSent)
          Column(
            children: [
              TextField(
                controller: _emailOtpController,
                enabled: !emailVerified,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 24, letterSpacing: 10, color: Colors.black),
                decoration: const InputDecoration(
                  hintText: "_ _ _ _ ",
                  border: InputBorder.none,
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: !emailVerified ? verifyEmailOtp : null,
                style: _buttonStyle(true),
                child: const Text("Verify"),
              ),
              const SizedBox(height: 4),
              emailVerified
                  ? const Text("Email Verified ✅", style: TextStyle(color: Colors.green))
                  : const Text("⏱️ 10:00", style: TextStyle(color: Colors.red)),
            ],
          ),
      ],
    );
  }

  Widget _buildPhoneVerificationContent() {
    bool isEnabled = emailVerified;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        TextField(
          controller: _phoneController,
          enabled: isEnabled && !phoneVerified,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.black),
          decoration: InputDecoration(
            hintText: 'Mobile Number',
            hintStyle: const TextStyle(color: Colors.black45),
            filled: true,
            fillColor: Colors.white.withOpacity(0.3),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
          ),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: isEnabled && !phoneVerified ? sendPhoneOtp : null,
          style: _buttonStyle(isEnabled),
          child: const Text("Send OTP"),
        ),
        const SizedBox(height: 8),
        const Text("OTP will be sent to your number. Valid till 10 minutes.",
            style: TextStyle(fontSize: 12, color: Colors.black)),
        const SizedBox(height: 12),
        if (phoneOtpSent)
          Column(
            children: [
              TextField(
                controller: _phoneOtpController,
                enabled: isEnabled && !phoneVerified,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 24, letterSpacing: 10, color: Colors.black),
                decoration: const InputDecoration(
                  hintText: "_ _ _ _",
                  border: InputBorder.none,
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: isEnabled && !phoneVerified ? verifyPhoneOtp : null,
                style: _buttonStyle(isEnabled),
                child: const Text("Verify"),
              ),
              const SizedBox(height: 4),
              phoneVerified
                  ? const Text("Phone Verified ✅", style: TextStyle(color: Colors.green))
                  : const Text("⏱️ 10:00", style: TextStyle(color: Colors.red)),
            ],
          ),
      ],
    );
  }

  Widget _buildFaceRecognitionContent() {
    bool isEnabled = phoneVerified;

    return Row(
      children: [
        Stack(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: Color(0xFF949393),
                shape: BoxShape.circle,
              ),
              child: const CircleAvatar(
                backgroundColor: Colors.transparent,
                backgroundImage: AssetImage('assets/face_sample.png'),
              ),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black,
                ),
                padding: const EdgeInsets.all(4),
                child: const Icon(Icons.edit, color: Colors.white, size: 14),
              ),
            ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text("Face Recognition",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black)),
              const Text("This image will be shown as your Profile Picture",
                  style: TextStyle(fontSize: 12, color: Colors.black)),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: isEnabled
                    ? () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const FaceVerificationScreen(),
                    ),
                  );
                }
                    : null,
                style: _buttonStyle(isEnabled),
                child: const Text("Start Verification"),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCard({
    required Widget child,
    bool isActive = false,
    bool showBorder = true,
    Color? color,
  }) {
    bool displayBorder = isActive || showBorder;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color ?? Colors.white.withOpacity(0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: displayBorder ? Colors.lightBlue : Colors.transparent,
          width: displayBorder ? 2.5 : 0,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: child,
    );
  }

  ButtonStyle _buttonStyle(bool isActive) {
    return ElevatedButton.styleFrom(
      backgroundColor: isActive ? Colors.black : const Color(0xFFADADAD),
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
    );
  }
}
