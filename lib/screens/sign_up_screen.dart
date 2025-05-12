import 'package:flutter/material.dart';
import 'sign_in_screen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final TextEditingController _dobController = TextEditingController();

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF00BCD4),
              onPrimary: Colors.black,
              surface: Colors.grey,
              onSurface: Colors.white,
            ),
            dialogBackgroundColor: Colors.black,
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _dobController.text = "${picked.day}/${picked.month}/${picked.year}";
      });
    }
  }

  @override
  void dispose() {
    _dobController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 30),
              Center(
                child: Image.asset(
                  'assets/logo.png',
                  width: 285,
                  height: 285,
                  fit: BoxFit.contain,
                ),
              ),
              const SizedBox(height: 30),
              const Text(
                'SIGN UP',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(child: _buildTextField(label: 'First Name')),
                  const SizedBox(width: 16),
                  Expanded(child: _buildTextField(label: 'Last Name')),
                ],
              ),
              const SizedBox(height: 20),
              _buildTextField(label: 'Email ID'),
              const SizedBox(height: 20),
              _buildTextField(label: 'Password', obscure: true),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _dobController,
                      readOnly: true,
                      onTap: () => _selectDate(context),
                      style: const TextStyle(color: Colors.white),
                      decoration: _inputDecoration(
                        'Date of Birth',
                        icon: Icons.calendar_today,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(child: _buildDropdown()),
                ],
              ),
              const SizedBox(height: 20),
              _buildTextField(label: 'Qualification'),
              const SizedBox(height: 40),
              Center(
                child: SizedBox(
                  width: 175,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const SignInScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00BCD4),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      'Signup',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  static InputDecoration _inputDecoration(String label, {IconData? icon}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white),
      suffixIcon: icon != null
          ? Icon(icon, color: Colors.white, size: 18)
          : null,
      enabledBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: Colors.white),
      ),
      focusedBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: Color(0xFF00BCD4)),
      ),
    );
  }

  static Widget _buildTextField({
    required String label,
    bool obscure = false,
    IconData? icon,
  }) {
    return TextField(
      obscureText: obscure,
      style: const TextStyle(color: Colors.white),
      decoration: _inputDecoration(label, icon: icon),
    );
  }

  static Widget _buildDropdown() {
    return DropdownButtonFormField<String>(
      decoration: _inputDecoration('Gender'),
      dropdownColor: Colors.grey[900],
      style: const TextStyle(color: Colors.white),
      items: ['Male', 'Female', 'Other']
          .map((value) => DropdownMenuItem<String>(
        value: value,
        child: Text(value),
      ))
          .toList(),
      onChanged: (value) {},
    );
  }
}
