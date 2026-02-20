import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../../styles/colors";

interface Props {
  saved: boolean;
  colors: ThemeColors;
  onSavePress: () => void;
  onApplyPress: () => void;
  onOpenLinkPress: () => void;
  applied?: boolean;
}

const BottomActionsBar: React.FC<Props> = ({ saved, colors, onSavePress, onApplyPress, onOpenLinkPress, applied }) => {
  return (
    <View
      style={[
        styles.bottomBar,
        { backgroundColor: colors.surface, borderColor: colors.border },
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
      ]}
    >
      <Pressable
        onPress={onSavePress}
        style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={22}
          color={saved ? colors.saveIcon : colors.text}
        />
      </Pressable>

      <Pressable
        onPress={onOpenLinkPress}
        style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]}
      >
        <Ionicons name="open-outline" size={20} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={onApplyPress}
        disabled={applied}
        style={[
          styles.applyButton,
          {
            backgroundColor: applied ? colors.mutedText : colors.primary,
            opacity: applied ? 0.5 : 1,
          },
        ]}
      >
        <Ionicons
          name={applied ? "checkmark-circle" : "paper-plane"}
          size={18}
          color={colors.background}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.applyText, { color: colors.background }]}>
          {applied ? "Applied" : "Apply Now"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 10,
  },
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  shadowAndroid: { elevation: 24 },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  applyText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
});

export default BottomActionsBar;
