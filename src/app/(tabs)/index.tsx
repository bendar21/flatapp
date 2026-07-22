import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Goto onboarding{" "}
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Goto sign in{" "}
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Goto sign up{" "}
      </Link>
      <Link
        href="/subscriptions/spotify"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        spotify subscription{" "}
      </Link>
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: { id: "claude" },
      }} >
        claude subscription
        </Link>
      
    </View>
  );
}
