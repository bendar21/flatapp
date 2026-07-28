import { useSignUp } from "@/src/context/AuthContext";
import { Link, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { signUp, verifyEmailCode, resendCode } = useSignUp();
  const router = useRouter();
  const posthog = usePostHog();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validation states
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Client-side validation
  const nameValid = name.trim().length > 0;
  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;
  const formValid =
    nameValid && emailAddress.length > 0 && password.length >= 8 && emailValid;

  const handleSubmit = async () => {
    if (!formValid) return;

    setIsSubmitting(true);
    setFormError(null);
    const { error } = await signUp(emailAddress, password);
    setIsSubmitting(false);

    if (error) {
      console.error(error);
      posthog.capture("user_sign_up_failed", { error_message: error });
      setFormError(error);
      return;
    }

    setNeedsVerification(true);
  };

  const handleVerify = async () => {
    if (code.trim().length < 6) {
      setFormError("Enter the 6-digit code from your email");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    const { error } = await verifyEmailCode(emailAddress, code, name.trim());
    setIsSubmitting(false);

    if (error) {
      console.error(error);
      setFormError(error);
      return;
    }

    posthog.identify(emailAddress, {
      $set: { email: emailAddress, name: name.trim() },
      $set_once: { sign_up_date: new Date().toISOString() },
    });
    posthog.capture("user_signed_up", { email: emailAddress });

    router.replace("/(tabs)" as Href);
  };

  const handleResend = async () => {
    setFormError(null);
    await resendCode(emailAddress);
  };

  // Show verification screen if email needs verification
  if (needsVerification) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              {/* Branding */}
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">F</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Flatmate</Text>
                    <Text className="auth-wordmark-sub">FLAT LIFE, SORTED</Text>
                  </View>
                </View>
                <Text className="auth-title">Verify your email</Text>
                <Text className="auth-subtitle">
                  We sent a verification code to {emailAddress}
                </Text>
              </View>

              {/* Verification Form */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className="auth-input"
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      onChangeText={(value) => {
                        setCode(value.replace(/[^0-9]/g, ""));
                        if (formError) setFormError(null);
                      }}
                      keyboardType="number-pad"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {formError && (
                      <Text className="auth-error">{formError}</Text>
                    )}
                  </View>

                  <Pressable
                    className={`auth-button ${(!code || isSubmitting) && "auth-button-disabled"}`}
                    onPress={handleVerify}
                    disabled={!code || isSubmitting}
                  >
                    <Text className="auth-button-text">
                      {isSubmitting ? "Verifying..." : "Verify Email"}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={handleResend}
                    disabled={isSubmitting}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend Code
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main sign-up form
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {/* Branding */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">F</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Flatmate</Text>
                  <Text className="auth-wordmark-sub">FLAT LIFE, SORTED</Text>
                </View>
              </View>
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Bills, chores, and the food tab — all sorted with your flat
              </Text>
            </View>

            {/* Sign-Up Form */}
            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Full Name</Text>
                  <TextInput
                    className={`auth-input ${nameTouched && !nameValid && "auth-input-error"}`}
                    value={name}
                    placeholder="Your name"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setName}
                    onBlur={() => setNameTouched(true)}
                    autoComplete="name"
                  />
                  {nameTouched && !nameValid && (
                    <Text className="auth-error">Name is required</Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Email Address</Text>
                  <TextInput
                    className={`auth-input ${emailTouched && !emailValid && "auth-input-error"}`}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {emailTouched && !emailValid && (
                    <Text className="auth-error">
                      Please enter a valid email address
                    </Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${passwordTouched && !passwordValid && "auth-input-error"}`}
                    value={password}
                    placeholder="Create a strong password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="password-new"
                  />
                  {passwordTouched && !passwordValid && (
                    <Text className="auth-error">
                      Password must be at least 8 characters
                    </Text>
                  )}
                  {!passwordTouched && (
                    <Text className="auth-helper">
                      Minimum 8 characters required
                    </Text>
                  )}
                </View>

                {formError && <Text className="auth-error">{formError}</Text>}

                <Pressable
                  className={`auth-button ${(!formValid || isSubmitting) && "auth-button-disabled"}`}
                  onPress={handleSubmit}
                  disabled={!formValid || isSubmitting}
                >
                  <Text className="auth-button-text">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-In Link */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
