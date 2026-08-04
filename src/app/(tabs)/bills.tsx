import BillCard from "@/components/BillCard";
import { useBillStore } from "@/lib/billStore";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Bills = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { bills } = useBillStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="text-3xl font-bold text-dark mb-5">Bills</Text>
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
    </SafeAreaView>
  );
};
export default Bills;
