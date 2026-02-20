import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Application } from "../../types";
import { ThemeColors } from "../../styles/colors";

interface Props {
  application: Application;
  colors: ThemeColors;
  onPress: () => void;
  onDelete: () => void;
}

const formatDate = (ts: number) => {
  const date = new Date(ts);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getDaysAgo = (ts: number) => {
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

const AppliedJobCard: React.FC<Props> = ({ application, colors, onPress, onDelete }) => {
  const { job } = application;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.primary }]}
    >
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <View style={[styles.logoBox, { borderColor: colors.border }]}>
            <Text style={[styles.fallbackLogo, { color: colors.text }]}>
              {job.companyName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={[styles.companyName, { color: colors.text }]} numberOfLines={1}>
              {job.companyName}
            </Text>
            <Text style={[styles.timeAgo, { color: colors.mutedText }]}>
              {getDaysAgo(application.submittedAt)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {job.title}
      </Text>

      <View style={styles.tagsContainer}>
        <View style={[styles.tagBadge, { borderColor: colors.success }]}>
          <Text style={[styles.tagText, { color: colors.success }]}>Applied</Text>
        </View>
        <View style={[styles.tagBadge, { borderColor: colors.border }]}>
          <Text style={[styles.tagText, { color: colors.text }]}>{formatDate(application.submittedAt)}</Text>
        </View>
        {job.jobType && (
          <View style={[styles.tagBadge, { borderColor: colors.border }]}>
            <Text style={[styles.tagText, { color: colors.text }]}>{job.jobType}</Text>
          </View>
        )}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <View style={styles.logistics}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            {job.locations?.[0] || "Remote"} • {job.workModel}
          </Text>
          <Text style={[styles.detailText, { color: colors.mutedText }]}>
            Tap to view application
          </Text>
        </View>
        <Pressable
          onPress={onDelete}
          style={[styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fallbackLogo: { fontSize: 16, fontWeight: "800", textTransform: "uppercase" },
  companyName: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeAgo: { fontSize: 13, marginTop: 2 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logistics: {
    flex: 1,
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

export default AppliedJobCard;
