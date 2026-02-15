import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Job } from "../contexts/JobsContext";
import { useSavedJobs } from "../contexts/SavedJobContext";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface JobCardProps {
  job: Job;
  onPress?: (event: GestureResponderEvent) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.guid);

  const handleSavePress = () => {
    saved ? removeJob(job.guid) : saveJob(job);
  };

  const getSalaryString = () => {
    if (!job.minSalary && !job.maxSalary) return null;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: job.currency || "USD",
      maximumFractionDigits: 0,
    });

    if (job.minSalary && job.maxSalary) {
      return `${formatter.format(job.minSalary)} - ${formatter.format(job.maxSalary)}`;
    }

    return formatter.format((job.minSalary || job.maxSalary) as number);
  };

  const getDaysAgo = (epochTime: number) => {
    const days = Math.floor((Date.now() / 1000 - epochTime) / 86400);
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  const salary = getSalaryString();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
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
            <Text style={[styles.timeAgo, { color: colors.mutedText }]}>
              {getDaysAgo(job.pubDate)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSavePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={saved ? colors.saveIcon : colors.mutedText}
          />
        </TouchableOpacity>
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
              Unlisted
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  logo: { width: "100%", height: "100%" },
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
    gap: 8, // Adds spacing between wrapped tags natively
    marginBottom: 16,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 4, // Keeps it sharp and stark
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
