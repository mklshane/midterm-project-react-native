import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../contexts/JobsContext";
import { ThemeColors } from "../../styles/colors";



interface Props {
  job: Job;
  salary: string | null;
  colors: ThemeColors;
  compact?: boolean;
  showLocationWorkModel?: boolean;
  scrollable?: boolean;
}

const LogisticsRow: React.FC<Props> = ({
  job,
  salary,
  colors,
  compact = false,
  showLocationWorkModel = false,
  scrollable = true,
}) => {
  const primaryLocation = job.locations?.[0] || "Remote";

  const chips = [
    {
      key: "salary",
      icon: "cash" as const,
      label: "Salary",
      value: salary || "Salary Unlisted",
    },
    ...(showLocationWorkModel
      ? [
          {
            key: "location",
            icon: "location-outline" as const,
            label: "Location",
            value: primaryLocation,
          },
          {
            key: "work-model",
            icon: "business-outline" as const,
            label: "Work model",
            value: job.workModel || "Remote",
          },
        ]
      : []),
    {
      key: "job-type",
      icon: "briefcase" as const,
      label: "Job type",
      value: job.jobType,
    },
    {
      key: "seniority",
      icon: "ribbon" as const,
      label: "Seniority",
      value: job.seniorityLevel,
    },
  ];

  if (!scrollable) {
    return (
      <View style={[styles.logisticsScroll, compact && styles.logisticsScrollCompact]}>
        <View style={styles.detailsGrid}>
          {chips.map((chip) => (
            <View
              key={chip.key}
              style={[styles.detailCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <View style={styles.detailTopRow}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={chip.icon} size={16} color={colors.primary} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.mutedText }]}>{chip.label}</Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
                {chip.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.logisticsScroll, compact && styles.logisticsScrollCompact]}
      contentContainerStyle={styles.logisticsRow}
    >
      {chips.map((chip) => (
        <View
          key={chip.key}
          style={[styles.logisticChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name={chip.icon} size={16} color={colors.primary} />
          </View>
          <Text style={[styles.logisticValue, { color: colors.text }]}>{chip.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logisticsScroll: { marginBottom: 32 },
  logisticsScrollCompact: { marginBottom: 4 },
  logisticsRow: { flexDirection: "row", gap: 10 },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  logisticChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 8,
    paddingRight: 16,
    gap: 10,
    borderWidth: 1,
  },
  detailCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 90,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  detailTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  detailLabel: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  detailValue: { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logisticValue: { fontSize: 14, fontWeight: "600" },
});

export default LogisticsRow;
