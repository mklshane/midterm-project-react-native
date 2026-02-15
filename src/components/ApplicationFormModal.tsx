import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface ApplicationFormModalProps {
  visible: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
  onSuccess: () => void;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  onClose,
  jobTitle,
  companyName,
  onSuccess,
}) => {
  const { colors } = useTheme();

  // Local Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !contact || !coverLetter) {
      Alert.alert(
        "Missing Fields",
        "Please fill out all fields before submitting.",
      );
      return;
    }

    setName("");
    setEmail("");
    setContact("");
    setCoverLetter("");

    Alert.alert(
      "Application Submitted",
      `Your application for ${jobTitle} has been successfully sent.`,
      [
        {
          text: "Okay",
          onPress: () => {
            onClose(); 
            onSuccess(); 
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet" // Native bottom-sheet look on iOS
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.modalScroll}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Apply for Role
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalJobTitle, { color: colors.primary }]}>
            {jobTitle}
          </Text>
          <Text style={[styles.modalCompanyName, { color: colors.mutedText }]}>
            {companyName}
          </Text>

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.border, marginVertical: 24 },
            ]}
          />

          {/* Form Fields */}
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Full Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            placeholderTextColor={colors.mutedText}
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            placeholderTextColor={colors.mutedText}
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Contact Number
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            placeholderTextColor={colors.mutedText}
            placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Why should we hire you?
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            placeholderTextColor={colors.mutedText}
            placeholder="Briefly explain why you are a great fit for this position..."
            multiline
            textAlignVertical="top"
            value={coverLetter}
            onChangeText={setCoverLetter}
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text
              style={[styles.submitButtonText, { color: colors.background }]}
            >
              Confirm Application
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  modalScroll: { padding: 24, paddingBottom: 60 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  modalJobTitle: { fontSize: 18, fontWeight: "800" },
  modalCompanyName: { fontSize: 16, fontWeight: "500", marginTop: 4 },
  divider: { height: 1.5, width: "100%" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    fontWeight: "500",
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    height: 140,
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default ApplicationFormModal;
