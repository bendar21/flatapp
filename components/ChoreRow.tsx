import { Image, Pressable, Text, View } from "react-native";

const ChoreRow = ({
  name,
  icon,
  assignee,
  completed,
  onComplete,
}: ChoreRowProps) => {
  return (
    <View className="sub-card">
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text className="sub-title" numberOfLines={1}>
              {name}
            </Text>
            <Text className="sub-meta" numberOfLines={1}>
              {assignee}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          {completed ? (
            <Text className="sub-billing">Done</Text>
          ) : (
            <Pressable
              onPress={onComplete}
              className="rounded-full bg-primary px-3 py-1.5"
            >
              <Text
                className="text-xs font-sans-bold"
                style={{ color: "#fff" }}
              >
                Tick off
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChoreRow;
