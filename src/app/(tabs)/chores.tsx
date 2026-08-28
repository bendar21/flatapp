import ChoreCard from "@/components/ChoreCard";
import CreateChoreModal from "@/components/CreateChoreModal";
import { icons } from "@/constants/icons";
import "@/global.css";
import { currentWeekStart } from "@/lib/choreAssignments";
import { useChoreStore } from "@/lib/choreStore";
import { useUser } from "@/src/context/AuthContext";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { chores, assignments, addChore, generateThisWeek } = useChoreStore();

  // Make sure this week's assignments exist before we try to read them.
  // Safe to call every mount — chores that already have this week's
  // assignment are skipped inside the generator.
  useEffect(() => {
    generateThisWeek();
  }, [generateThisWeek]);

  const weekStart = currentWeekStart();

  // Assignments belonging to the signed-in user, this week, not yet done —
  // this replaces the old "chores.filter(status/assignee)" logic.
  const myOpenAssignments = useMemo(() => {
    return assignments
      .filter(
        (a) =>
          a.weekStart === weekStart &&
          a.assignee === user?.firstName &&
          !a.completed,
      )
      .map((a) => {
        const chore = chores.find((c) => c.id === a.choreId);
        return {
          assignment: a,
          choreName: chore?.name ?? "Chore",
          icon: chore?.icon ?? icons.add,
          daysLeft: dayjs(a.weekStart).add(6, "day").diff(dayjs(), "day"),
        };
      });
  }, [assignments, chores, weekStart, user?.firstName]);

  const handleChorePress = (item: Chore) => {
    const isExpanding = expandedChoreId !== item.id;
    setExpandedChoreId((currentId) => (currentId === item.id ? null : item.id));
    posthog.capture(isExpanding ? "chore_expanded" : "chore_collapsed", {
      chore_name: item.name,
      chore_id: item.id,
    });
  };

  const handleCreateChore = (newChore: Chore) => {
    addChore(newChore);
    posthog.capture("chore_created", { chore_name: newChore.name });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={chores}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-3xl font-sans-bold text-primary">
                Chores
              </Text>
              <Pressable onPress={() => setIsModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ChoreCard
            {...item}
            expanded={expandedChoreId === item.id}
            onPress={() =>
              setExpandedChoreId(expandedChoreId === item.id ? null : item.id)
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <CreateChoreModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateChore}
      />
    </SafeAreaView>
  );
}
