import "@/global.css";
import { useAuth } from "@/src/context/AuthContext";
import { useFlat } from "@/src/context/FlatContext";
import { clsx } from "clsx";
import { router } from "expo-router";
import { styled } from "nativewind";
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

const FlatSetup = () => {
  const { createFlat, joinFlat } = useFlat();
  const { signOut } = useAuth();
  const [mode, setMode] = useState<"create" | "join">("create");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    mode === "create"
      ? name.trim().length > 0 && address.trim().length > 0
      : code.trim().length >= 6;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);

    const result =
      mode === "create"
        ? await createFlat(name, address)
        : await joinFlat(code);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
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
              <Text className="auth-title">
                {mode === "create" ? "Set up your flat" : "Join your flat"}
              </Text>
              <Text className="auth-subtitle">
                {mode === "create"
                  ? "You'll get a code to share with your flatmates"
                  : "Ask a flatmate for their invite code"}
              </Text>
            </View>

            <View className="auth-card">
              <View className="flex-row gap-2 mb-4">
                <Pressable
                  onPress={() => setMode("create")}
                  className={clsx(
                    "flex-1 items-center rounded-full py-2 border",
                    mode === "create"
                      ? "bg-accent border-accent"
                      : "border-border",
                  )}
                >
                  <Text
                    className={clsx(
                      "text-sm font-sans-semibold",
                      mode === "create"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Create a flat
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode("join")}
                  className={clsx(
                    "flex-1 items-center rounded-full py-2 border",
                    mode === "join"
                      ? "bg-accent border-accent"
                      : "border-border",
                  )}
                >
                  <Text
                    className={clsx(
                      "text-sm font-sans-semibold",
                      mode === "join"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Join a flat
                  </Text>
                </Pressable>
              </View>

              <View className="auth-form">
                {mode === "create" ? (
                  <>
                    <View className="auth-field">
                      <Text className="auth-label">Flat name</Text>
                      <TextInput
                        className="auth-input"
                        placeholder="e.g. Castle Street Flat"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                    <View className="auth-field">
                      <Text className="auth-label">Address</Text>
                      <TextInput
                        className="auth-input"
                        placeholder="123 Castle St"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        value={address}
                        onChangeText={setAddress}
                      />
                    </View>
                  </>
                ) : (
                  <View className="auth-field">
                    <Text className="auth-label">Invite code</Text>
                    <TextInput
                      className="auth-input"
                      placeholder="ABC123"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      autoCapitalize="characters"
                      value={code}
                      onChangeText={setCode}
                      maxLength={6}
                    />
                  </View>
                )}

                {error && <Text className="auth-error">{error}</Text>}

                <Pressable
                  className={clsx(
                    "auth-button",
                    (!isValid || isSubmitting) && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!isValid || isSubmitting}
                >
                  <Text className="auth-button-text">
                    {isSubmitting
                      ? "Just a sec…"
                      : mode === "create"
                        ? "Create flat"
                        : "Join flat"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Pressable onPress={signOut}>
                <Text className="auth-link">Sign out</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FlatSetup;
