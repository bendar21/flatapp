import { Link } from "expo-router";
import { Text, View } from "react-native";

const Subscriptions = () => {
  return (
    <View>
      <Text>subscriptions</Text>
      <Link href="/(auth)/sign-in">sign in</Link>
    </View>
  );
};

export default Subscriptions;
