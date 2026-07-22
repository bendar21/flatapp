import { Link } from "expo-router";
import { Text, View } from "react-native";

const Insights = () => {
  return (
    <View>
      <Text>insights</Text>
      <Link href="/(auth)/sign-in">sign in</Link>
    </View>
  );
};

export default Insights;
