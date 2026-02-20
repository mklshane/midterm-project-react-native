import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../styles/colors";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  colors: ThemeColors;
  onConfirm: () => void;
}

const ApplicationSuccessModal: React.FC<Props> = ({ visible, title, message, colors, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onConfirm}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(16,185,129,0.1)" }]}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.mutedText }]}>{message}</Text>
          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={onConfirm}>
            <Text style={[styles.buttonText, { color: colors.background }]}>Okay</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  message: { fontSize: 15, fontWeight: "500", textAlign: "center", lineHeight: 22 },
  button: {
    marginTop: 4,
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  buttonText: { fontSize: 16, fontWeight: "700" },
});

export default ApplicationSuccessModal;
