import { icons } from "@/constants/icons";
import { posthog } from "@/src/config/posthog";
import clsx from "clsx";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface CreateChoreModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (chore: Chore) => void;
}

type Category =
  | "Kitchen"
  | "Bathroom"
  | "Bins & recycling"
  | "Living areas"
  | "Outdoor"
  | "Other";

const CATEGORIES: Category[] = [
  "Kitchen",
  "Bathroom",
  "Bins & recycling",
  "Living areas",
  "Outdoor",
  "Other",
];

const CATEGORY_COLORS: Record<Category, string> = {
  Kitchen: "#f5c542",
  Bathroom: "#b8d4e3",
  "Bins & recycling": "#95e1d3",
  "Living areas": "#e8def8",
  Outdoor: "#a8d8a8",
  Other: "#d4d4d4",
};

const CreateChoreModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateChoreModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [delegationType, setDelegationType] = useState<
    "random_weekly" | "fixed_rotation"
  >("random_weekly");
  const [membersInput, setMembersInput] = useState("");

  const members = membersInput
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const isValidForm = name.trim().length > 0 && members.length > 0;

  const handleSubmit = () => {
    if (!isValidForm) return;

    const newChore: Chore = {
      id: `chore-${Date.now()}`,
      name: name.trim(),
      category,
      color: CATEGORY_COLORS[category],
      delegationType,
      members,
      icon: icons.plus,
    };

    onSubmit(newChore);
    posthog.capture("chore_created", {
      chore_name: name.trim(),
      delegation_type: delegationType,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setCategory("Other");
    setDelegationType("random_weekly");
    setMembersInput("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable
            className="modal-container"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="modal-header">
              <Text className="modal-title">New Chore</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. Take out bins"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCategory(c)}
                      className={clsx(
                        "rounded-full px-3 py-1.5 border",
                        category === c
                          ? "border-primary"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: CATEGORY_COLORS[c] }}
                    >
                      <Text
                        className="text-xs font-sans-medium"
                        style={{ color: "#2C2C2A" }}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Whos in the rotation?</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Ben, Alex, Sam"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={membersInput}
                  onChangeText={setMembersInput}
                />
                <Text className="mt-1 text-xs font-sans-medium text-muted-foreground">
                  Comma-separated names for now — placeholder until flat members
                  come from the flat itself.
                </Text>
              </View>

              <View className="auth-field">
                <Text className="auth-label">How should it rotate?</Text>
                <View className="flex-row gap-2">
                  {(["random_weekly", "fixed_rotation"] as const).map(
                    (type) => (
                      <Pressable
                        key={type}
                        onPress={() => setDelegationType(type)}
                        className={clsx(
                          "flex-1 items-center rounded-full py-2 border",
                          delegationType === type
                            ? "bg-primary border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        <Text
                          className="text-xs font-sans-medium"
                          style={{
                            color: delegationType === type ? "#fff" : undefined,
                          }}
                        >
                          {type === "random_weekly"
                            ? "Random weekly"
                            : "Fixed rotation"}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !isValidForm && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={!isValidForm}
              >
                <Text className="auth-button-text">Create Chore</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateChoreModal;
