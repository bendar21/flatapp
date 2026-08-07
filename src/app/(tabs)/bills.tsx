import BillCard from "@/components/BillCard";
import CreateBillModal from "@/components/CreateBillModal";
import { icons } from "@/constants/icons";
import { useBillStore } from "@/lib/billStore";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Bills = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { bills, addBill } = useBillStore();
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-3xl font-sans-bold text-primary">
                Bills
              </Text>
              <Pressable onPress={() => setIsBillModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <BillCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
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

      <CreateBillModal
        visible={isBillModalVisible}
        onClose={() => setIsBillModalVisible(false)}
        onSubmit={addBill}
      />
    </SafeAreaView>
  );
};
export default Bills;
