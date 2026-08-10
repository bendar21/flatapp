import ChoreRow from "@/components/ChoreRow";
import CreateBillModal from "@/components/CreateBillModal";
import CreateChoreModal from "@/components/CreateChoreModal";
import ListHeading from "@/components/ListHeading";
import UpcomingBillCard from "@/components/UpcomingBillCard";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { useBillStore } from "@/lib/billStore";
import { currentWeekStart } from "@/lib/choreAssignments";
import { useChoreStore } from "@/lib/choreStore";
import { useUser } from "@/src/context/AuthContext";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
  const { user } = useUser();
  const posthog = usePostHog();
  const { bills, addBill } = useBillStore();
  const {
    chores,
    assignments,
    addChore,
    completeAssignment,
    generateThisWeek,
  } = useChoreStore();

  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const [isChoreModalVisible, setIsChoreModalVisible] = useState(false);

  useEffect(() => {
    generateThisWeek();
  }, [generateThisWeek]);

  const weekStart = currentWeekStart();

  const upcomingBills = useMemo(() => {
    const now = dayjs();
    const nextWeek = now.add(7, "days");
    return bills
      .filter(
        (b) =>
          b.status === "active" &&
          dayjs(b.renewalDate).isAfter(now) &&
          dayjs(b.renewalDate).isBefore(nextWeek),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [bills]);

  // This week's chores for the whole flat, joined against their chore
  // definition for name/icon — see the note below about this join.
  const thisWeeksChores = useMemo(() => {
    return assignments
      .filter((a) => a.weekStart === weekStart)
      .map((a) => {
        const chore = chores.find((c) => c.id === a.choreId);
        return {
          assignment: a,
          name: chore?.name ?? "Chore",
          icon: chore?.icon ?? icons.add,
        };
      });
  }, [assignments, chores, weekStart]);

  const handleCreateBill = (newBill: Bill) => {
    addBill(newBill);
    posthog.capture("bill_created", {
      bill_name: newBill.name,
      bill_price: newBill.price,
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="home-header">
          <View className="home-user">
            <Image
              source={avatarUrl ? { uri: avatarUrl } : images.avatar}
              className="home-avatar"
            />
            <Text className="home-user-name">{displayName}</Text>
          </View>

          <View className="flex-row gap-3"></View>
        </View>

        <View className="mb-6 mt-4">
          <ListHeading title="Upcoming bills" />
          <FlatList
            data={upcomingBills}
            renderItem={({ item }) => (
              <UpcomingBillCard daysLeft={0} {...item} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="home-empty-state">
                Nothing due in the next week.
              </Text>
            }
          />
        </View>

        <View>
          <ListHeading title="This week's chores" />
          <View style={{ gap: 8 }}>
            {thisWeeksChores.length === 0 && (
              <Text className="home-empty-state">No chores set up yet.</Text>
            )}
            {thisWeeksChores.map(({ assignment, name, icon }) => (
              <ChoreRow
                key={assignment.id}
                name={name}
                icon={icon}
                assignee={assignment.assignee}
                completed={assignment.completed}
                onComplete={() => completeAssignment(assignment.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <CreateBillModal
        visible={isBillModalVisible}
        onClose={() => setIsBillModalVisible(false)}
        onSubmit={handleCreateBill}
      />
      <CreateChoreModal
        visible={isChoreModalVisible}
        onClose={() => setIsChoreModalVisible(false)}
        onSubmit={handleCreateChore}
      />
    </SafeAreaView>
  );
}
