import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeColors } from "../../styles/colors";

interface Props {
  tags: string[];
  colors: ThemeColors;
  compact?: boolean;
}

const TagsList: React.FC<Props> = ({ tags, colors, compact = false }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <View style={[styles.tagsContainer, compact && styles.tagsContainerCompact]}>
      {tags.map((tag, index) => (
        <View
          key={index}
          style={[
            styles.tagBadge,
            { backgroundColor: colors.primaryLight, borderColor: colors.border },
          ]}
        >
          <View style={[styles.tagDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tagsContainerCompact: { marginBottom: 4 },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    gap: 7,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: { fontSize: 13, fontWeight: "600" },
});

export default TagsList;
