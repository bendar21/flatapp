import "@/global.css";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { usePostHog } from "posthog-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Exported so index.tsx can check the same key. Keep this string in sync —
// it's just a flag saying "this device has already seen the welcome screen".
export const ONBOARDING_SEEN_KEY = "hasSeenOnboarding";

const Onboarding = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("onboarding_started");
  }, [posthog]);

  const handleGetStarted = async () => {
    await SecureStore.setItemAsync(ONBOARDING_SEEN_KEY, "true");
    posthog.capture("onboarding_completed");
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <View className="auth-screen">
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="auth-logo-mark"
            style={{ width: 88, height: 88, borderRadius: 24 }}
          >
            <Text className="auth-logo-mark-text" style={{ fontSize: 40 }}>
              F
            </Text>
          </View>

          <Text
            className="auth-title"
            style={{ marginTop: 28, textAlign: "center" }}
          >
            Welcome to Flatmate
          </Text>
          <Text className="auth-subtitle">
            Bills, chores, and the running food tab — all sorted in one place,
            so your flat stops arguing about who owes what.
          </Text>
        </View>

        <View className="px-6 pb-10">
          <TouchableOpacity className="auth-button" onPress={handleGetStarted}>
            <Text className="auth-button-text">Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
