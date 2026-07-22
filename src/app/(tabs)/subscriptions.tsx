import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  return (
    <SafeAreaView>
      <Text>subscriptions</Text>
      <Link href="/(auth)/sign-in">sign in</Link>
    </SafeAreaView>
  );
};

export default Subscriptions;
