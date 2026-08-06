import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const ChoreCard = ({
  name,
  icon,
  category,
  color,
  delegationType,
  currentAssignee,
  completed,
  expanded,
  onPress,
}: ChoreCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-xl bg-background p-4"
      style={{ borderLeftWidth: 4, borderLeftColor: color ?? "#888780" }}
    >
      <View className="flex-row items-center gap-3">
        <Image source={icon} style={{ width: 28, height: 28 }} />
        <View>
          <Text className="font-sans-bold text-primary">{name}</Text>
          {category && (
            <Text className="text-xs font-sans-medium text-muted-foreground">
              {category}
            </Text>
          )}
        </View>
      </View>

      <View className="items-end">
        <Text className="text-xs font-sans-medium text-muted-foreground">
          {currentAssignee ?? "Unassigned"}
        </Text>
        {completed && (
          <Text
            className="text-xs font-sans-medium"
            style={{ color: "#0F6E56" }}
          >
            Done ✓
          </Text>
        )}
        {expanded && (
          <Text className="mt-1 text-xs font-sans-medium text-muted-foreground">
            {delegationType === "random_weekly"
              ? "Random weekly"
              : "Fixed rotation"}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default ChoreCard;
