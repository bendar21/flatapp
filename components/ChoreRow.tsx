import React from "react";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    Text,
    View,
} from "react-native";

interface ChoreRowProps {
  name: string;
  icon: ImageSourcePropType;
  assignee: string;
  completed: boolean;
  onComplete: () => void;
}

const ChoreRow = ({
  name,
  icon,
  assignee,
  completed,
  onComplete,
}: ChoreRowProps) => {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-background p-3">
      <View className="flex-row items-center gap-3">
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <View>
          <Text className="font-sans-bold text-primary">{name}</Text>
          <Text className="text-xs font-sans-medium text-muted-foreground">
            {assignee}
          </Text>
        </View>
      </View>

      {completed ? (
        <Text className="text-xs font-sans-medium" style={{ color: "#0F6E56" }}>
          Done ✓
        </Text>
      ) : (
        <Pressable
          onPress={onComplete}
          className="rounded-full bg-primary px-3 py-1.5"
        >
          <Text className="text-xs font-sans-medium" style={{ color: "#fff" }}>
            Complete
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ChoreRow;
