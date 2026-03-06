import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../../styles/colors";

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  colors: ThemeColors;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, colors }) => (
  <View style={styles.row}>
    <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
      <Ionicons name={icon} size={16} color={colors.primary} />
    </View>
    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 17, fontWeight: "800", letterSpacing: -0.2 },
});

export default SectionHeader;
