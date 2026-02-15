import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RenderHtml from "react-native-render-html";
import { RootStackParamList } from "../navigation/props";
import { useTheme } from "../contexts/ThemeContext";
import { useSavedJobs } from "../contexts/SavedJobContext";
import { Ionicons } from "@expo/vector-icons";

import ApplicationFormModal from "../components/ApplicationFormModal";

type Props = NativeStackScreenProps<RootStackParamList, "JobDetails">;

const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job, fromSavedJobs } = route.params;
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.guid);

  // Form Visibility State
  const [isFormVisible, setFormVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      headerTintColor: colors.text,
      headerShadowVisible: false, // Removes the header bottom border for a cleaner look
      headerStyle: { backgroundColor: colors.background },
    });
  }, [navigation, colors]);

  const handleSavePress = () => {
    saved ? removeJob(job.guid) : saveJob(job);
  };

  const handleApplyPress = () => {
    setFormVisible(true);
  };

  const handleApplicationSuccess = () => {
    if (fromSavedJobs) {
      navigation.navigate("Find");
    }
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

  const salary = getSalaryString();

  // Polished Typography for HTML
  const tagsStyles = {
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 26,
      fontWeight: "400" as const,
    },
    p: { marginBottom: 16, lineHeight: 26 },
    h1: {
      fontSize: 24,
      fontWeight: "800" as const,
      marginTop: 24,
      marginBottom: 12,
      color: colors.text,
    },
    h2: {
      fontSize: 20,
      fontWeight: "700" as const,
      marginTop: 20,
      marginBottom: 10,
      color: colors.text,
    },
    h3: {
      fontSize: 18,
      fontWeight: "600" as const,
      marginTop: 16,
      marginBottom: 8,
    },
    ul: { paddingLeft: 20, marginTop: 4, marginBottom: 16 },
    li: { marginBottom: 8, lineHeight: 24, color: colors.text },
    a: {
      color: colors.primary,
      textDecorationLine: "none" as const,
      fontWeight: "600" as const,
    },
    strong: { fontWeight: "700" as const, color: colors.text },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header Row */}
        <View style={styles.headerRow}>
          <View style={[styles.logoBox, { backgroundColor: colors.surface }]}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <Text style={[styles.fallbackLogo, { color: colors.primary }]}>
                {job.companyName.charAt(0)}
              </Text>
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text
              style={[styles.companyName, { color: colors.text }]}
              numberOfLines={1}
            >
              {job.companyName}
            </Text>
            <View style={styles.locationWrapper}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.mutedText}
              />
              <Text style={[styles.locationText, { color: colors.mutedText }]}>
                {job.locations?.[0] || "Remote"} • {job.workModel}
              </Text>
            </View>
          </View>
        </View>

        {/* Big Title */}
        <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>

        {/* Tags (Soft Pills) */}
        {job.tags && job.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {job.tags.map((tag, index) => (
              <View
                key={index}
                style={[styles.tagBadge, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Logistics (Icon-driven Chips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.logisticsScroll}
        >
          <View style={styles.logisticsRow}>
            <View
              style={[styles.logisticChip, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons name="cash" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.logisticValue, { color: colors.text }]}>
                {salary || "Unlisted"}
              </Text>
            </View>

            <View
              style={[styles.logisticChip, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons name="briefcase" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.logisticValue, { color: colors.text }]}>
                {job.jobType}
              </Text>
            </View>

            <View
              style={[styles.logisticChip, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons name="ribbon" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.logisticValue, { color: colors.text }]}>
                {job.seniorityLevel}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Job Description
          </Text>
          <RenderHtml
            contentWidth={width - 40}
            source={{
              html: job.description || "<p>No description provided.</p>",
            }}
            tagsStyles={tagsStyles}
            baseStyle={{ color: colors.text }}
          />
        </View>
      </ScrollView>

      {/* Floating Bottom Actions Bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.background },
          Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
        ]}
      >
        <TouchableOpacity
          onPress={handleSavePress}
          style={[styles.saveButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={26}
            color={saved ? colors.saveIcon : colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApplyPress}
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.applyText, { color: colors.background }]}>
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* Application Form Component */}
      <ApplicationFormModal
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        jobTitle={job.title}
        companyName={job.companyName}
        onSuccess={handleApplicationSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 130 }, // Padding for floating bar
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16, // Softer squircle shape
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%" },
  fallbackLogo: { fontSize: 24, fontWeight: "bold" },
  companyInfo: { flex: 1, justifyContent: "center" },
  companyName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  locationWrapper: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 14, fontWeight: "500" },
  title: { fontSize: 32, fontWeight: "800", lineHeight: 38, marginBottom: 16 },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  tagBadge: {
    borderRadius: 20, // Pill shape
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tagText: { fontSize: 13, fontWeight: "600" },

  logisticsScroll: { marginBottom: 32 },
  logisticsRow: { flexDirection: "row", gap: 12 },
  logisticChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 8,
    paddingRight: 16,
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logisticValue: { fontSize: 15, fontWeight: "600" },

  divider: { height: 1, width: "100%", marginBottom: 24, opacity: 0.5 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  descriptionContainer: { paddingBottom: 20 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  shadowAndroid: {
    elevation: 20,
  },
  saveButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  applyButton: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  applyText: { fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },
});

export default JobDetailsScreen;
