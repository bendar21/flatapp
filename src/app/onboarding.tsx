import { SLIDES } from "@/constants/data";
import "@/global.css";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export const ONBOARDING_SEEN_KEY = "hasSeenOnboarding";

const Onboarding = () => {
  const posthog = usePostHog();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    posthog.capture("onboarding_started");
  }, [posthog]);

  const finishOnboarding = async () => {
    await SecureStore.setItemAsync(ONBOARDING_SEEN_KEY, "true");
    posthog.capture("onboarding_completed", {
      last_slide: SLIDES[activeIndex].key,
    });
    router.replace("/(auth)/sign-in");
  };

  const goToNext = () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex >= SLIDES.length) {
      finishOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{ flex: 5 }}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(slide) => slide.key}
          horizontal
          pagingEnabled
          snapToInterval={width}
          decelerationRate="fast"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View
              style={{ width }}
              className="flex-1 items-center justify-center px-8"
            >
              <Text style={{ fontSize: 88 }}>{item.icon}</Text>
              <Text
                className="auth-title"
                style={{ marginTop: 28, textAlign: "center" }}
              >
                {item.title}
              </Text>
              <Text className="auth-subtitle" style={{ textAlign: "center" }}>
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        <View className="flex-row justify-center gap-2 mb-6">
          {SLIDES.map((slide, index) => (
            <View
              key={slide.key}
              className={
                index === activeIndex
                  ? "w-6 h-2 rounded-full bg-primary"
                  : "w-2 h-2 rounded-full bg-primary/30"
              }
            />
          ))}
        </View>

        <View className="px-6 pb-2">
          <Pressable className="auth-button" onPress={goToNext}>
            <Text className="auth-button-text">
              {isLastSlide ? "Get started" : "Next"}
            </Text>
          </Pressable>
        </View>
        <View className="px-6 pb-10">
          <Pressable className="auth-secondary-button" onPress={goToNext}>
            <Text className="auth-button-text">Already have an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
