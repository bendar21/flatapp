import images from "@/constants/images";
import "@/global.css";
import { useUser } from "@/src/context/AuthContext";
import { styled } from "nativewind";
import { Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
  const { user } = useUser();

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "there";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="home-avatar"
          />
          <Text className="home-user-name">Hey, {displayName}</Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-2xl font-sans-bold text-primary mb-2">
          Youre signed in 🎉
        </Text>
        <Text className="text-base font-sans-medium text-muted-foreground">
          Place holder page.
        </Text>
      </View>
    </SafeAreaView>
  );
}
