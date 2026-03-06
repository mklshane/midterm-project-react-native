import React, { useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/props";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useTheme } from "../../contexts/ThemeContext";
import TagsList from "../../components/JobDetails/TagsList";
import LogisticsRow from "../../components/JobDetails/LogisticsRow";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import MetaChip from "../../components/Base/MetaChip";
import SectionHeader from "../../components/Base/SectionHeader";
import { formatSalary, formatMsDate } from "../../utils/formatting";
import { styles } from "./ApplicationDetails.styles";

const ApplicationDetailsScreen: React.FC<NativeStackScreenProps<RootStackParamList, "ApplicationDetails">> = ({ route, navigation }) => {
  const { applicationId } = route.params;
  const { applications, removeApplication } = useApplications();
  const { colors } = useTheme();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const application = applications.find((a) => a.id === applicationId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      headerTintColor: colors.text,
      headerShadowVisible: false,
    });
  }, [navigation, colors]);

  if (!application) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>        
        <View style={styles.emptyWrapper}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Application not found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>It may have been removed. Go back to Applied to view others.</Text>
          <Pressable style={[styles.backButton, { backgroundColor: colors.buttonPrimary }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: colors.buttonText }]}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { job } = application;
  const salary = formatSalary(job);

  const onCancelApplication = () => setConfirmVisible(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <View style={styles.topRow}>
            <View style={[styles.pretitleBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="briefcase" size={12} color={colors.primary} />
              <Text style={[styles.pretitle, { color: colors.primary }]}>Applied Job</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + "1A" }]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={[styles.statusText, { color: colors.success }]}>Submitted</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.company, { color: colors.mutedText }]}>{job.companyName}</Text>

          <View style={styles.metaRow}>
            <MetaChip icon="calendar-outline" label="Submitted" value={formatMsDate(application.submittedAt)} colors={colors} />
            <MetaChip icon="person-outline" label="Applicant" value={application.name} colors={colors} numberOfLines={1} />
          </View>

          <LogisticsRow job={job} salary={salary} colors={colors} scrollable={false} />
          <TagsList tags={job.tags} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <SectionHeader icon="document-text-outline" title="Application details" colors={colors} />

          <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>            
            <View style={styles.fieldRow}>
              <View style={styles.fieldHeader}>
                <Ionicons name="person-outline" size={13} color={colors.mutedText} />
                <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Name</Text>
              </View>
              <Text style={[styles.fieldValue, { color: colors.text }]} numberOfLines={2}>{application.name}</Text>
            </View>
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <View style={styles.fieldRow}>
              <View style={styles.fieldHeader}>
                <Ionicons name="mail-outline" size={13} color={colors.mutedText} />
                <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Email</Text>
              </View>
              <Text style={[styles.fieldValue, { color: colors.text }]} numberOfLines={2}>{application.email}</Text>
            </View>
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <View style={styles.fieldRow}>
              <View style={styles.fieldHeader}>
                <Ionicons name="call-outline" size={13} color={colors.mutedText} />
                <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Contact</Text>
              </View>
              <Text style={[styles.fieldValue, { color: colors.text }]}>{application.contact}</Text>
            </View>
          </View>

          <View style={[styles.coverLetter, { backgroundColor: colors.background, borderColor: colors.border }]}>            
            <View style={styles.sectionHeaderSmall}>
              <Ionicons name="chatbox-ellipses-outline" size={14} color={colors.mutedText} />
              <Text style={[styles.badgeLabel, { color: colors.mutedText }]}>Cover letter</Text>
            </View>
            <Text style={[styles.coverText, { color: colors.text }]}>{application.coverLetter || "No cover letter provided."}</Text>
          </View>

          <View style={styles.actions}>            
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: colors.buttonPrimary, borderColor: colors.buttonPrimary }]}
              onPress={() => navigation.navigate("JobDetails", { job, fromApplied: true })}
            >
              <Ionicons name="open-outline" size={16} color={colors.buttonText} />
              <Text style={[styles.secondaryText, { color: colors.buttonText }]}>View job</Text>
            </Pressable>
            <Pressable
              style={[styles.dangerButton, { backgroundColor: colors.background, borderColor: colors.error }]}
              onPress={onCancelApplication}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={[styles.dangerText, { color: colors.error }]}>Cancel application</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <DeleteConfirmModal
        visible={confirmVisible}
        colors={colors}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          removeApplication(application.id);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default ApplicationDetailsScreen;
