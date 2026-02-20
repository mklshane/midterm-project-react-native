import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { ThemeColors } from "../../styles/colors";

interface Props {
  visible: boolean;
  colors: ThemeColors;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ visible, colors, onCancel, onConfirm }) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Remove this application?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            This will delete it from your applied list. You can re-apply anytime from the job details.
          </Text>
          <View style={styles.actions}>
            <Pressable style={[styles.button, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: colors.background, borderColor: colors.error }]} onPress={onConfirm}>
              <Text style={[styles.confirmText, { color: colors.error }]}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", borderRadius: 16, padding: 20, borderWidth: 1, gap: 12 },
  title: { fontSize: 18, fontWeight: "800" },
  subtitle: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  actions: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 8 },
  button: { flex: 1, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  cancelText: { fontSize: 15, fontWeight: "700" },
  confirmText: { fontSize: 15, fontWeight: "700" },
});

export default DeleteConfirmModal;
