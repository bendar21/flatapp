import React from "react";
import { Image, Text, View } from "react-native";

const AssignedChoreCard = ({
  name,

  daysLeft,
  icon,
}: AssignedChore) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};
export default AssignedChoreCard;
