import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, GestureResponderEvent, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Application } from "../../types";
import { ThemeColors } from "../../styles/colors";
import { cardStyles } from "../../styles/globalStyles";
import { useSavedJobs } from "../../contexts/SavedJobContext";
import { getDaysAgoFromMs, formatMsDate } from "../../utils/formatting";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Props {
  application: Application;
  colors: ThemeColors;
  onPress: () => void;
  onDelete: () => void;
}

const AppliedJobCard: React.FC<Props> = ({ application, colors, onPress, onDelete }) => {
  const { job } = application;
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.guid);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false);

  const handleSavePress = (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (saved) {
      setShowUnsaveConfirm(true);
      return;
    }

    saveJob(job);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.primary }]}
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
            <Text style={[styles.companyName, { color: colors.text }]} numberOfLines={1}>
              {job.companyName}
            </Text>
            <Text style={[styles.timeAgo, { color: colors.mutedText }]}>
              {getDaysAgoFromMs(application.submittedAt)}
            </Text>
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

      <View style={styles.tagsContainer}>
        <View style={[styles.tagBadge, { borderColor: colors.success }]}>
          <Text style={[styles.tagText, { color: colors.success }]}>Applied</Text>
        </View>
        <View style={[styles.tagBadge, { borderColor: colors.border }]}>
          <Text style={[styles.tagText, { color: colors.text }]}>{formatMsDate(application.submittedAt, false)}</Text>
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

      <DeleteConfirmModal
        visible={showUnsaveConfirm}
        colors={colors}
        title="Unsave this job?"
        message="This will remove the job from your saved list. You can save it again anytime."
        confirmLabel="Unsave"
        icon="bookmark-outline"
        onCancel={() => setShowUnsaveConfirm(false)}
        onConfirm={() => {
          setShowUnsaveConfirm(false);
          removeJob(job.guid);
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...cardStyles,
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
