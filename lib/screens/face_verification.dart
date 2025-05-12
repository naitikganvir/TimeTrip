import 'dart:io';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_mlkit_face_detection/google_mlkit_face_detection.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:google_mlkit_commons/google_mlkit_commons.dart';
import 'dart:io' show Platform;

class FaceVerificationScreen extends StatefulWidget {
  const FaceVerificationScreen({super.key});

  @override
  State<FaceVerificationScreen> createState() => _FaceVerificationScreenState();
}

class _FaceVerificationScreenState extends State<FaceVerificationScreen> {
  late CameraController _cameraController;
  bool _isCameraInitialized = false;
  bool _isUnsupportedPlatform = false;
  late FaceDetector _faceDetector;
  bool _isDetecting = false;
  bool _faceDetected = false;
  // Test mode flag - set to true to test UI on desktop platforms
  bool testMode = true;

  @override
  void initState() {
    super.initState();
    _initializeFaceDetection();
  }

  Future<void> _initializeFaceDetection() async {
    // Check for unsupported platforms first, but allow testing on desktop with testMode
    if ((Platform.isWindows || Platform.isLinux || Platform.isMacOS) && !testMode) {
      setState(() {
        _isUnsupportedPlatform = true;
      });
      return;
    }

    // For test mode on desktop platforms, skip camera initialization but set up UI
    if ((Platform.isWindows || Platform.isLinux || Platform.isMacOS) && testMode) {
      // Create face detector for test mode
      final options = FaceDetectorOptions(
        enableContours: true,
        enableClassification: true,
      );
      _faceDetector = FaceDetector(options: options);

      // Simulate camera initialization
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isCameraInitialized = true;
            // Auto-detect face after a delay for testing
            Future.delayed(const Duration(seconds: 3), () {
              if (mounted) {
                setState(() => _faceDetected = true);
              }
            });
          });
        }
      });
      return;
    }

    // Normal mobile implementation continues below
    // Request camera permission
    if (await Permission.camera.request().isGranted) {
      try {
        final cameras = await availableCameras();
        if (cameras.isEmpty) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('No cameras available')),
            );
          }
          return;
        }

        final frontCamera = cameras.firstWhere(
              (cam) => cam.lensDirection == CameraLensDirection.front,
          orElse: () => cameras.first,
        );

        _cameraController = CameraController(
          frontCamera,
          ResolutionPreset.medium,
          enableAudio: false,
        );

        await _cameraController.initialize();
        if (!mounted) return;

        setState(() => _isCameraInitialized = true);

        final options = FaceDetectorOptions(
          enableContours: true,
          enableClassification: true,
        );
        _faceDetector = FaceDetector(options: options);

        _startImageStream();
      } catch (e) {
        debugPrint('Error initializing camera: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Camera initialization error: $e')),
          );
        }
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Camera permission denied')),
        );
      }
    }
  }

  void _startImageStream() {
    _cameraController.startImageStream((CameraImage image) async {
      if (_isDetecting) return;

      _isDetecting = true;

      try {
        final WriteBuffer allBytes = WriteBuffer();
        for (Plane plane in image.planes) {
          allBytes.putUint8List(plane.bytes);
        }
        final bytes = allBytes.done().buffer.asUint8List();

        final inputImage = InputImage.fromBytes(
          bytes: bytes,
          metadata: InputImageMetadata(
            size: Size(image.width.toDouble(), image.height.toDouble()),
            rotation: InputImageRotation.rotation0deg,
            format: InputImageFormat.nv21,
            bytesPerRow: image.planes.first.bytesPerRow,
          ),
        );

        final List<Face> faces = await _faceDetector.processImage(inputImage);

        if (faces.isNotEmpty && !_faceDetected) {
          if (mounted) {
            setState(() => _faceDetected = true);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Face detected!')),
            );
          }
        }
      } catch (e) {
        debugPrint('Error during face detection: $e');
      }

      _isDetecting = false;
    });
  }

  @override
  void dispose() {
    if (_isCameraInitialized) {
      _cameraController.dispose();
    }
    if (!_isUnsupportedPlatform) {
      _faceDetector.close();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Face Verification')),
      body: _isUnsupportedPlatform
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 80, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Camera not supported on this platform',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Please use a mobile device instead.',
              style: TextStyle(color: Colors.grey.shade700),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Go Back'),
            ),
          ],
        ),
      )
          : _isCameraInitialized
          ? Stack(
        children: [
          // For test mode on desktop, show a placeholder instead of camera preview
          (Platform.isWindows || Platform.isLinux || Platform.isMacOS) && testMode
              ? Container(
            color: Colors.black,
            child: const Center(
              child: Text(
                "CAMERA PREVIEW\n(Test Mode)",
                style: TextStyle(color: Colors.white, fontSize: 24),
                textAlign: TextAlign.center,
              ),
            ),
          )
              : CameraPreview(_cameraController),
          if (_faceDetected)
            const Center(
              child: Icon(Icons.check_circle, color: Colors.green, size: 80),
            ),
          // Add a test button for desktop test mode
          if ((Platform.isWindows || Platform.isLinux || Platform.isMacOS) && testMode)
            Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: Center(
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _faceDetected = !_faceDetected;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  child: Text(_faceDetected ? "Undetect Face" : "Detect Face"),
                ),
              ),
            ),
        ],
      )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}