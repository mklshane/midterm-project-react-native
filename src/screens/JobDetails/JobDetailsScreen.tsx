import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Linking,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/props";
import { useTheme } from "../../contexts/ThemeContext";
import { useSavedJobs } from "../../contexts/SavedJobContext";
import { useApplications } from "../../contexts/ApplicationsContext";
import ApplicationFormModal from "../../components/ApplicationFormModal";
import CompanyHeader from "../../components/JobDetails/CompanyHeader";
import TagsList from "../../components/JobDetails/TagsList";
import LogisticsRow from "../../components/JobDetails/LogisticsRow";
import DescriptionSection from "../../components/JobDetails/DescriptionSection";
import BottomActionsBar from "../../components/JobDetails/BottomActionsBar";
import ThemeToggle from "../../components/Base/ThemeToggle";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import { styles } from "./JobDetails.styles";

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
  const [isUnsaveConfirmVisible, setIsUnsaveConfirmVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      headerTintColor: colors.text,
      headerShadowVisible: false,
    });
  }, [navigation, colors]);

  const handleSavePress = () => {
    if (saved) {
      setIsUnsaveConfirmVisible(true);
      return;
    }

    saveJob(job);
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

      <DeleteConfirmModal
        visible={isUnsaveConfirmVisible}
        colors={colors}
        title="Unsave this job?"
        message="This will remove it from your saved list. You can always save it again later."
        confirmLabel="Unsave"
        icon="bookmark-outline"
        onCancel={() => setIsUnsaveConfirmVisible(false)}
        onConfirm={() => {
          removeJob(job.guid);
          setIsUnsaveConfirmVisible(false);
        }}
      />
    </View>
  );
};

export default JobDetailsScreen;
