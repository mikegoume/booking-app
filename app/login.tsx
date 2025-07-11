import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { LogIn, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(username.trim());
      setIsLoading(false);

      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Failed",
          "Username not found. Try: john, sarah, mike, emma, or alex",
        );
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient colors={["#4f46e5", "#7c3aed"]} style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <User size={40} color="#ffffff" />
            </View>
            <Text style={styles.appTitle}>FitBook</Text>
            <Text style={styles.appSubtitle}>Personal Training Booking</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>
              Enter your username to continue
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={
                  isLoading ? ["#94a3b8", "#94a3b8"] : ["#4f46e5", "#7c3aed"]
                }
                style={styles.loginButtonGradient}
              >
                <LogIn size={20} color="#ffffff" />
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    height: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#ffffff",
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  loginCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
});
