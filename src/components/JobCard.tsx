import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Job } from "../types";
import { useSavedJobs } from "../contexts/SavedJobContext";
import { useTheme } from "../contexts/ThemeContext";
import { useApplications } from "../contexts/ApplicationsContext";
import { formatSalary, getDaysAgoFromEpoch } from "../utils/formatting";
import { cardStyles } from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

interface JobCardProps {
  job: Job;
  onPress?: (event: GestureResponderEvent) => void;
  onRemove?: (jobGuid: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onRemove }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const { isApplied } = useApplications();
  const saved = isJobSaved(job.guid);
  const applied = isApplied(job.guid);

  const handleSavePress = () => {
    if (saved && onRemove) {
      onRemove(job.guid);
    } else if (saved) {
      removeJob(job.guid);
    } else {
      saveJob(job);
    }
  };

  const salary = formatSalary(job);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.primary },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <View style={[styles.logoBox, { borderColor: colors.border }]}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <Text style={[styles.fallbackLogo, { color: colors.text }]}>
                {job.companyName.charAt(0)}
              </Text>
            )}
          </View>
          <View>
            <Text style={[styles.companyName, { color: colors.text }]}>
              {job.companyName}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.timeAgo, { color: colors.mutedText }]}>
                {getDaysAgoFromEpoch(job.pubDate)}
              </Text>
              {applied ? (
                <View style={[styles.appliedPill, { backgroundColor: colors.success + "1A", borderColor: colors.success }]}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <Text style={[styles.appliedText, { color: colors.success }]}>Applied</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleSavePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={saved ? colors.saveIcon : colors.mutedText}
          />
        </Pressable>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {job.title}
      </Text>

      {job.tags && job.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {job.tags.slice(0, 4).map((tag, index) => (
            <View
              key={index}
              style={[styles.tagBadge, { borderColor: colors.border }]}
            >
              <Text style={[styles.tagText, { color: colors.text }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <View style={styles.logistics}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            {job.locations?.[0] || "Remote"} • {job.workModel}
          </Text>
          <Text style={[styles.detailText, { color: colors.mutedText }]}>
            {job.jobType} • {job.seniorityLevel}
          </Text>
        </View>
        <View style={styles.salaryBox}>
          {salary ? (
            <Text style={[styles.salaryText, { color: colors.text }]}>
              {salary}
            </Text>
          ) : (
            <Text style={[styles.unlistedText, { color: colors.mutedText }]}>
              Salary Unlisted
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...cardStyles,
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  appliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  appliedText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  salaryBox: {
    alignItems: "flex-end",
  },
  salaryText: {
    fontSize: 15,
    fontWeight: "800",
  },
  unlistedText: {
    fontSize: 13,
    fontWeight: "400",
    fontStyle: "italic", 
  },
});

export default JobCard;
