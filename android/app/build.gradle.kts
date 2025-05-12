plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.time_trip"

    // Set compileSdk and targetSdk to a value >= API 31
    compileSdk = 35  // Ensure you're using at least API 31
    ndkVersion = "27.0.12077973"  // Ensure correct NDK version for compatibility

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.time_trip"
        minSdk = 21  // Set the minimum SDK to 21 or higher
        targetSdk = 35  // Ensure this is at least API 31 or higher (API 33 is the latest stable version)
        versionCode = 1 // Update the version code
        versionName = "1.0.0" // Update the version name
    }

    // Signing configuration for the release build
    signingConfigs {
        create("release") {
            storeFile = file("C:/Users/naiti/StudioProjects/time_trip/android/app/my-release-key.jks") // Correct path to your keystore file
            storePassword = "123456"  // Replace with your keystore password
            keyAlias = "my-key-alias" // Replace with your key alias
            keyPassword = "123456"    // Replace with your key password
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true  // Enable Proguard or R8 if required
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")  // Use the release signing config
        }
    }
}

flutter {
    source = "../.."  // Make sure the source is correct relative to your project structure
}
