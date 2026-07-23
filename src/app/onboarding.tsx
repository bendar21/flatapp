import "@/global.css";
import React, { useEffect } from "react";
import { usePostHog } from "posthog-react-native";
import { Text, View } from "react-native";

const Onboarding = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("onboarding_started");
  }, [posthog]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-xl font-bold text-blue-500">Onboarding</Text>
    </View>
  );
};

export default Onboarding;
