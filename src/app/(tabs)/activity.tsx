import "@/global.css";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Explore() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-2">active</Text>
      <Text className="text-base font-sans-medium text-muted-foreground text-center">
        Empty starter screen.
      </Text>
    </SafeAreaView>
  );
}
