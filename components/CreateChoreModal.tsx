import { icons } from "@/constants/icons";
import { posthog } from "@/src/config/posthog";
import clsx from "clsx";
import dayjs from "dayjs";
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
  | "Entertainment"
  | "AI Tools"
  | "Developer Tools"
  | "Design"
  | "Productivity"
  | "Other";

const CATEGORIES: Category[] = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Other",
];
const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#95e1d3",
  Other: "#d4d4d4",
};

const CreateChoreModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateChoreModalProps) => {
  const [name, setName] = useState("");
  const isValidForm = true;
  const handleSubmit = () => {
    if (!isValidForm) return;

    const now = dayjs();

    const newChore: Chore = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      status: "active",
      doDate: now.toISOString(),
      assignee: "ben",
      icon: icons.plus,
    };

    onSubmit(newChore);

    posthog.capture("chore_created", {
      chore_name: name.trim(),
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
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
                  placeholder="Chore name"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  keyboardType="decimal-pad"
                />
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
