import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const AssignedChoreCard = ({
  choreName,
  icon,
  daysLeft,
  completed,
  onComplete,
}: AssignedChoreCardProps) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <Text className="upcoming-meta" numberOfLines={1}>
          {completed
            ? "Done ✓"
            : daysLeft > 1
              ? `${daysLeft} days left`
              : "Last day"}
        </Text>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {choreName}
      </Text>

      {!completed && (
        <Pressable
          onPress={onComplete}
          className="mt-2 self-start rounded-full bg-primary px-3 py-1"
        >
          <Text className="text-xs font-sans-medium" style={{ color: "#fff" }}>
            Mark complete
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default AssignedChoreCard;
