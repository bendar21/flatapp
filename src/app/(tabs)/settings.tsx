import { Link } from "expo-router";
import { Text, View } from "react-native";

const Settings = () => {
  return (
    <View>
      <Text>settings</Text>
      <Link href="/(auth)/sign-in">sign in</Link>
    </View>
  );
};

export default Settings;
