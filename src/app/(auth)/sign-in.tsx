import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Text>sign ing</Text>
      <Link href="/(auth)/sign-up">create account</Link>
    </View>
  );
};

export default SignUp;
