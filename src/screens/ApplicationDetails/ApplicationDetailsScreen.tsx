import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/props";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useTheme } from "../../contexts/ThemeContext";
import TagsList from "../../components/JobDetails/TagsList";
import LogisticsRow from "../../components/JobDetails/LogisticsRow";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import { styles } from "./ApplicationDetails.styles";

const formatDate = (ts: number) => new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const ApplicationDetailsScreen: React.FC<NativeStackScreenProps<RootStackParamList, "ApplicationDetails">> = ({ route, navigation }) => {
  const { applicationId } = route.params;
  const { applications, removeApplication } = useApplications();
  const { colors } = useTheme();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const application = applications.find((a) => a.id === applicationId);

  if (!application) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>        
        <View style={styles.emptyWrapper}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Application not found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>It may have been removed. Go back to Applied to view others.</Text>
          <Pressable style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: colors.background }]}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { job } = application;
  const salary = (() => {
    if (!job.minSalary && !job.maxSalary) return null;
    const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: job.currency || "USD", maximumFractionDigits: 0 });
    if (job.minSalary && job.maxSalary) return `${fmt.format(job.minSalary)} - ${fmt.format(job.maxSalary)}`;
    return fmt.format((job.minSalary || job.maxSalary) as number);
  })();

  const onCancelApplication = () => setConfirmVisible(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <Text style={[styles.pretitle, { color: colors.mutedText }]}>Job</Text>
          <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.company, { color: colors.mutedText }]}>{job.companyName}</Text>
          <LogisticsRow job={job} salary={salary} colors={colors} />
          <TagsList tags={job.tags} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <Text style={[styles.pretitle, { color: colors.mutedText }]}>Application</Text>
          <Text style={[styles.subheading, { color: colors.text }]}>Submitted {formatDate(application.submittedAt)}</Text>

          <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>            
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Name</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]} numberOfLines={2}>{application.name}</Text>
            </View>
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Email</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]} numberOfLines={2}>{application.email}</Text>
            </View>
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Contact</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>{application.contact}</Text>
            </View>
          </View>

          <View style={[styles.coverLetter, { backgroundColor: colors.background, borderColor: colors.border }]}>            
            <Text style={[styles.badgeLabel, { color: colors.mutedText, marginBottom: 6 }]}>Cover letter</Text>
            <Text style={[styles.coverText, { color: colors.text }]}>{application.coverLetter || "No cover letter provided."}</Text>
          </View>

          <View style={styles.actions}>            
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => navigation.navigate("JobDetails", { job, fromApplied: true })}
            >
              <Text style={[styles.secondaryText, { color: colors.background }]}>View job</Text>
            </Pressable>
            <Pressable
              style={[styles.dangerButton, { backgroundColor: colors.background, borderColor: colors.error }]}
              onPress={onCancelApplication}
            >
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
