import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/props";
import { useTheme } from "../contexts/ThemeContext";
import { useSavedJobs } from "../contexts/SavedJobContext";
import { useApplications } from "../contexts/ApplicationsContext";
import ApplicationFormModal from "../components/ApplicationFormModal";
import CompanyHeader from "../components/JobDetails/CompanyHeader";
import TagsList from "../components/JobDetails/TagsList";
import LogisticsRow from "../components/JobDetails/LogisticsRow";
import DescriptionSection from "../components/JobDetails/DescriptionSection";
import BottomActionsBar from "../components/JobDetails/BottomActionsBar";
import ThemeToggle from "../components/Base/ThemeToggle";

type Props = NativeStackScreenProps<RootStackParamList, "JobDetails">;

const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params;
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const { isApplied } = useApplications();
  const saved = isJobSaved(job.guid);
  const applied = isApplied(job.guid);

  const [isFormVisible, setFormVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      headerTintColor: colors.text,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: colors.background },
      headerTitle: "",
    });
  }, [navigation, colors]);

  const handleSavePress = () => {
    saved ? removeJob(job.guid) : saveJob(job);
  };

  const handleApplyPress = () => {
    if (applied) return;
    setFormVisible(true);
  };

  const handleOpenLink = async () => {
    const url = job.applicationLink;
    if (!url) {
      Alert.alert("Link unavailable", "This job does not have an application link.");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert("Cannot open link", "Your device cannot open this URL.");
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Cannot open link", "Something went wrong while opening the URL.");
    }
  };

  const handleApplicationSuccess = () => {
    navigation.reset({ index: 0, routes: [{ name: "Tabs", params: { screen: "Find" } }] });
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

  const formatDate = (value?: number) => {
    if (!value) return "N/A";
    return new Date(value * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const postedOn = formatDate(job.pubDate);
  const expiresOn = formatDate(job.expiryDate);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.topRow}>
            <View style={[styles.pretitleBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="briefcase" size={12} color={colors.primary} />
              <Text style={[styles.pretitle, { color: colors.primary }]}>Job Overview</Text>
            </View>
            <View style={styles.topActions}>
              {applied && (
                <View style={[styles.statusBadge, { backgroundColor: colors.success + "1A" }]}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={[styles.statusText, { color: colors.success }]}>Applied</Text>
                </View>
              )}
              {saved && !applied && (
                <View style={[styles.statusBadge, { backgroundColor: colors.saveIcon + "1A" }]}>
                  <Ionicons name="bookmark" size={14} color={colors.saveIcon} />
                  <Text style={[styles.statusText, { color: colors.saveIcon }]}>Saved</Text>
                </View>
              )}
              <ThemeToggle isDarkMode={isDarkMode} color={colors.text} onToggle={toggleTheme} />
            </View>
          </View>

          <CompanyHeader job={job} colors={colors} />

          <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>

          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="grid-outline" size={12} color={colors.mutedText} />
              <Text style={[styles.categoryText, { color: colors.mutedText }]}>
                {job.mainCategory || "General"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.metaRow}>
            <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Posted</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{postedOn}</Text>
              </View>
            </View>
            <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="time-outline" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Expires</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{expiresOn}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Compensation & Role ── */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="stats-chart" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Compensation & Role</Text>
          </View>
          <LogisticsRow
            job={job}
            salary={salary}
            colors={colors}
            compact
            showLocationWorkModel
            scrollable={false}
          />
        </View>

        {/* ── Skills & Tools ── */}
        {job.tags?.length > 0 ? (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="code-slash" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills & Tools</Text>
            </View>
            <TagsList tags={job.tags} colors={colors} compact />
          </View>
        ) : null}

        {/* ── Description ── */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <DescriptionSection
            description={job.description}
            contentWidth={width - 56}
            colors={colors}
          />
        </View>
      </ScrollView>

      <BottomActionsBar
        saved={saved}
        colors={colors}
        onSavePress={handleSavePress}
        onApplyPress={handleApplyPress}
        onOpenLinkPress={handleOpenLink}
        applied={applied}
      />

      <ApplicationFormModal
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        job={job}
        jobTitle={job.title}
        companyName={job.companyName}
        onSuccess={handleApplicationSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 140, gap: 12 },

  /* ── Hero ── */
  heroCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pretitleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pretitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.3,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 8,
    borderRadius: 1,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },
  metaChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metaIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metaValue: { fontSize: 13, fontWeight: "700" },

  /* ── Section Cards ── */
  sectionCard: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", letterSpacing: -0.2 },
});

export default JobDetailsScreen;
