import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../contexts/JobsContext";
import { ThemeColors } from "../../styles/colors";

interface Props {
  job: Job;
  colors: ThemeColors;
}

const CompanyHeader: React.FC<Props> = ({ job, colors }) => {
  const primaryLocation = job.locations?.[0];

  return (
    <View style={styles.headerRow}>
      <View
        style={[
          styles.logoBox,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={styles.logo} resizeMode="cover" />
        ) : (
          <Text style={[styles.fallbackLogo, { color: colors.text }]}>
            {job.companyName.charAt(0)}
          </Text>
        )}
      </View>

      <View style={styles.companyInfo}>
        <Text style={[styles.companyName, { color: colors.text }]} numberOfLines={1}>
          {job.companyName}
        </Text>
        {primaryLocation ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.mutedText} />
            <Text style={[styles.locationText, { color: colors.mutedText }]} numberOfLines={1}>
              {primaryLocation}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  logo: { width: "100%", height: "100%" },
  fallbackLogo: { fontSize: 22, fontWeight: "800" },
  companyInfo: { flex: 1, justifyContent: "center", gap: 3 },
  companyName: { fontSize: 16, fontWeight: "700", letterSpacing: -0.2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: { fontSize: 13, fontWeight: "500" },
});

export default CompanyHeader;
