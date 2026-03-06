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
import MetaChip from "../../components/Base/MetaChip";
import SectionHeader from "../../components/Base/SectionHeader";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import { formatSalary, formatEpochDate } from "../../utils/formatting";
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

  const salary = formatSalary(job);
  const postedOn = formatEpochDate(job.pubDate);
  const expiresOn = formatEpochDate(job.expiryDate);

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
            <MetaChip icon="calendar-outline" label="Posted" value={postedOn} colors={colors} />
            <MetaChip icon="time-outline" label="Expires" value={expiresOn} colors={colors} />
          </View>
        </View>

        {/* ── Compensation & Role ── */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SectionHeader icon="stats-chart" title="Compensation & Role" colors={colors} />
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
            <SectionHeader icon="code-slash" title="Skills & Tools" colors={colors} />
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
