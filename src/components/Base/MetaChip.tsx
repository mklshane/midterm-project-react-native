import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../../styles/colors";

interface MetaChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ThemeColors;
  numberOfLines?: number;
}

const MetaChip: React.FC<MetaChipProps> = ({ icon, label, value, colors, numberOfLines }) => (
  <View style={[styles.chip, { backgroundColor: colors.background, borderColor: colors.border }]}>
    <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
      <Ionicons name={icon} size={14} color={colors.primary} />
    </View>
    <View>
      <Text style={[styles.label, { color: colors.mutedText }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]} numberOfLines={numberOfLines}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  value: { fontSize: 13, fontWeight: "700", marginTop: 2 },
});

export default MetaChip;
