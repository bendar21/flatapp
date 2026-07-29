import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ONBOARDING_SEEN_KEY } from "./onboarding";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_SEEN_KEY).then((value) => {
      setHasSeenOnboarding(value === "true");
    });
  }, []);

  // Wait for both auth state and the onboarding flag to load before
  // deciding anything — redirecting too early would flash the wrong screen.
  if (!isLoaded || hasSeenOnboarding === null) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
};

export default Index;
