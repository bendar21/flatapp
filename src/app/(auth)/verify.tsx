import "@/global.css";
import { useAuth } from "@/src/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Verify = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp, signInWithOtp } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    if (!email) return;
    if (code.trim().length < 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const { error: verifyError } = await verifyOtp(email, code);
    setIsSubmitting(false);

    if (verifyError) {
      setError(verifyError);
      return;
    }

    // AuthProvider's onAuthStateChange picks up the new session; the
    // (auth) layout redirects to /(tabs) automatically once it does.
    router.replace("/(tabs)");
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError(null);
    const { error: resendError } = await signInWithOtp(email);
    setIsResending(false);

    if (resendError) {
      setError(resendError);
      return;
    }
    setResent(true);
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">F</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Flatmate</Text>
                <Text className="auth-wordmark-sub">Flat life, sorted</Text>
              </View>
            </View>
            <Text className="auth-title">Check your email</Text>
            <Text className="auth-subtitle">
              We sent a 6-digit code to {email ?? "your email"}. Enter it below
              to finish signing in.
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Verification code</Text>
                <TextInput
                  className={
                    error ? "auth-input auth-input-error" : "auth-input"
                  }
                  placeholder="123456"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  value={code}
                  onChangeText={(value) => {
                    setCode(value.replace(/[^0-9]/g, ""));
                    if (error) setError(null);
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={handleVerify}
                  editable={!isSubmitting}
                />
                {error ? <Text className="auth-error">{error}</Text> : null}
              </View>

              <TouchableOpacity
                className={
                  isSubmitting
                    ? "auth-button auth-button-disabled"
                    : "auth-button"
                }
                onPress={handleVerify}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Verify and continue</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">Didn&apos;t get it?</Text>
              <View className="auth-divider-line" />
            </View>

            <TouchableOpacity
              className="auth-secondary-button"
              onPress={handleResend}
              disabled={isResending}
            >
              <Text className="auth-secondary-button-text">
                {isResending
                  ? "Resending…"
                  : resent
                    ? "Code resent"
                    : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Wrong email?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="auth-link">Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verify;
