
import BillCard from "@/components/BillCard";
import CreateBillModal from "@/components/CreateBillModal";
import ListHeading from "@/components/ListHeading";
import UpcomingBillCard from "@/components/UpcomingBillCard";
import { HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { useBillStore } from "@/lib/billStore";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/src/config/supabase";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from 'posthog-react-native';
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default async function App() {
    const { data: { user } } = await supabase.auth.getUser()
    const posthog = usePostHog();
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { bills, addBill } = useBillStore();

    // Get upcoming bills (active bills with renewal date within next 7 days)
    const upcomingBills = useMemo(() => {
        const now = dayjs();
        const nextWeek = now.add(7, 'days');
        return bills.filter(sub =>
            sub.status === 'active' &&
            dayjs(sub.renewalDate).isAfter(now) &&
            dayjs(sub.renewalDate).isBefore(nextWeek)
        ).sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
    }, [bills]);

    const handleBillPress = (item: Bill) => {
        const isExpanding = expandedBillId !== item.id;
        setExpandedBillId((currentId) => (currentId === item.id ? null : item.id));
        posthog.capture(isExpanding ? 'bill_expanded' : 'bill_collapsed', {
            bill_name: item.name,
            bill_id: item.id,
        });
    };

    const handleCreateBill = (newBill: Bill) => {
        addBill(newBill);
        posthog.capture('bill_created', {
            bill_name: newBill.name,
            bill_price: newBill.price,
            // ensure we don't pass undefined (not assignable to JsonType)
            bill_frequency: newBill.frequency ?? null,
            bill_category: newBill.category ?? null,
        });
    };

    // Get user display name from possible Supabase user fields: user_metadata or email
    const displayName =
        user?.user_metadata?.firstName ||
        user?.user_metadata?.first_name ||
        user?.user_metadata?.fullName ||
        user?.user_metadata?.full_name ||
        user?.email ||
        'User';

    // Resolve avatar URL from possible user metadata fields
    const avatarUrl =
        // common camelCase or snake_case keys used in various auth providers
        (user as any)?.user_metadata?.imageUrl ||
        (user as any)?.user_metadata?.image_url ||
        (user as any)?.user_metadata?.avatar ||
        (user as any)?.user_metadata?.avatar_url ||
        (user as any)?.user_metadata?.picture ||
        (user as any)?.user_metadata?.photoUrl ||
        (user as any)?.user_metadata?.photo_url ||
        // fallback to top-level possible fields
        (user as any)?.photoURL ||
        (user as any)?.avatar_url ||
        null;

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
                                        {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-5">
                                <ListHeading title="Upcoming" />

                                <FlatList
                                    data={upcomingBills}
                                    renderItem={({ item }) => (<UpcomingBillCard daysLeft={0} {...item} />)}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                                />
                            </View>

                            <ListHeading title="All Bills" />
                        </>
                    )}
                    data={bills}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BillCard
                            {...item}
                            expanded={expandedBillId === item.id}
                            onPress={() => handleBillPress(item)}
                        />
                    )}
                    extraData={expandedBillId}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No bills yet.</Text>}
                    contentContainerClassName="pb-30"
                />

            <CreateBillModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleCreateBill}
            />
        </SafeAreaView>
    );
}