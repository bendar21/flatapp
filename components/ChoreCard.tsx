import { clsx } from "clsx";
import { Image, Pressable, Text, View } from "react-native";

const ChoreCard = ({
  name,
  icon,
  color,
  category,
  delegationType,
  currentAssignee,
  completed,
  expanded,
  onPress,
  onCancelPress,
  isCancelling,
}: ChoreCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text className="sub-title" numberOfLines={1}>
              {name}
            </Text>
            {category && (
              <Text className="sub-meta" numberOfLines={1}>
                {category}
              </Text>
            )}
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{currentAssignee ?? "Unassigned"}</Text>
          <Text className="sub-billing">{completed ? "Done" : "Pending"}</Text>
        </View>
      </View>

      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Rotation</Text>
              </View>
              <Text className="sub-value">
                {delegationType === "random_weekly"
                  ? "Random weekly"
                  : "Fixed rotation"}
              </Text>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">This week</Text>
              </View>
              <Text className="sub-value">
                {currentAssignee ?? "Unassigned"}
              </Text>
            </View>
          </View>

          {!completed && onCancelPress && (
            <Pressable
              onPress={onCancelPress}
              disabled={isCancelling}
              className={clsx(
                "sub-cancel",
                isCancelling && "sub-cancel-disabled",
              )}
            >
              <Text className="sub-cancel-text">
                {isCancelling ? "Marking…" : "Mark complete"}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default ChoreCard;
