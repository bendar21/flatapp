import UpcomingChoreCard from "@/components/AssignedChoreCard";
import ChoreCard from "@/components/ChoreCard";
import CreateChoreModal from "@/components/CreateChoreModal";
import ListHeading from "@/components/ListHeading";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
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
  const {
    chores,
    assignments,
    addChore,
    completeAssignment,
    generateThisWeek,
  } = useChoreStore();

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

  const displayName = user?.fullName || "User";
  const avatarUrl = user?.imageUrl;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={avatarUrl ? { uri: avatarUrl } : images.avatar}
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>

              <Pressable onPress={() => setIsModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="mb-5">
              <ListHeading title="Your chores this week" />

              <FlatList
                data={myOpenAssignments}
                renderItem={({ item }) => (
                  <UpcomingChoreCard
                    choreName={item.choreName}
                    icon={item.icon}
                    daysLeft={item.daysLeft}
                    completed={false}
                    onComplete={() => completeAssignment(item.assignment.id)}
                  />
                )}
                keyExtractor={(item) => item.assignment.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    Nothing on your plate this week 🎉
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Chores" />
          </>
        )}
        data={chores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const thisWeek = assignments.find(
            (a) => a.choreId === item.id && a.weekStart === weekStart,
          );
          return (
            <ChoreCard
              {...item}
              currentAssignee={thisWeek?.assignee}
              completed={thisWeek?.completed ?? false}
              expanded={expandedChoreId === item.id}
              onPress={() => handleChorePress(item)}
            />
          );
        }}
        extraData={{ expandedChoreId, assignments }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No chores yet.</Text>
        }
        contentContainerClassName="pb-30"
      />

      <CreateChoreModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateChore}
      />
    </SafeAreaView>
  );
}
