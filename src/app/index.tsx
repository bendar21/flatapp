import { useAuth } from "@/src/context/AuthContext";
import { useFlat } from "@/src/context/FlatContext";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ONBOARDING_SEEN_KEY } from "./onboarding";

const Index = () => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { hasFlat, isLoaded: flatLoaded } = useFlat();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_SEEN_KEY).then((value) => {
      setHasSeenOnboarding(value === "true");
    });
  }, []);

  if (!authLoaded || hasSeenOnboarding === null) return null;

  if (isSignedIn) {
    if (!flatLoaded) return null;
    return <Redirect href={hasFlat ? "/(tabs)" : "/flat-setup"} />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
};

export default Index;
