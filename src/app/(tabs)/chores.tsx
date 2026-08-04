import UpcomingChoreCard from "@/components/AssignedChoreCard";
import ChoreCard from "@/components/ChoreCard";
import CreateChoreModal from "@/components/CreateChoreModal";
import ListHeading from "@/components/ListHeading";
import { HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { useChoreStore } from "@/lib/choreStore";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@/src/context/AuthContext";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  // ← no "async"
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { chores, addChore } = useChoreStore();

  // Get upcoming chores (active chores with renewal date within next 7 days)
  const assignedChores = useMemo(() => {
    return chores.filter(
      (sub) => sub.status === "active" && sub.assignee === user?.firstName,
    );
  }, [chores, user?.firstName]);

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
    posthog.capture("chore_created", {
      chore_name: newChore.name,
    });
  };

  // Get user display name from possible Supabase user fields: user_metadata or email
  const displayName = user?.fullName || "User";
  const avatarUrl = user?.imageUrl;

  // Resolve avatar URL from possible user metadata fields

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

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={assignedChores}
                renderItem={({ item }) => (
                  <UpcomingChoreCard daysLeft={0} {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Chores" />
          </>
        )}
        data={chores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChoreCard
            {...item}
            expanded={expandedChoreId === item.id}
            onPress={() => handleChorePress(item)}
          />
        )}
        extraData={expandedChoreId}
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
