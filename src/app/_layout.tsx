import "@/global.css";
import React, { useEffect, useRef } from "react";
import { ClerkProvider, useUser } from "@clerk/expo";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { posthog } from "@/src/config/posthog";

// Global JS error handler — catches unhandled exceptions outside the React tree
const _prevGlobalHandler = (globalThis as any).ErrorUtils?.getGlobalHandler?.()
;(globalThis as any).ErrorUtils?.setGlobalHandler?.((error: Error, isFatal: boolean) => {
  posthog.captureException(error)
  _prevGlobalHandler?.(error, isFatal)
})

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    posthog.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

function PostHogIdentifier() {
  const { user, isLoaded } = useUser();
  const ph = usePostHog();
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      const setProps: Record<string, string> = {};
      if (user.primaryEmailAddress?.emailAddress) setProps.email = user.primaryEmailAddress.emailAddress;
      if (user.fullName) setProps.name = user.fullName;
      ph.identify(user.id, { $set: setProps });
      prevUserIdRef.current = user.id;
    } else if (prevUserIdRef.current !== undefined) {
      ph.reset();
      prevUserIdRef.current = undefined;
    }
  }, [isLoaded, user, ph]);

  return null;
}

export default function RootLayout() {
  return (
    <RootErrorBoundary>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""}
        tokenCache={tokenCache}
      >
        <PostHogProvider client={posthog} autocapture>
          <PostHogIdentifier />
          <Stack />
        </PostHogProvider>
      </ClerkProvider>
    </RootErrorBoundary>
  );
}
