import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeColors } from "../../styles/colors";

interface Props {
  colors: ThemeColors;
}

const AppliedEmpty: React.FC<Props> = ({ colors }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>No applications yet</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Apply to a role from the Finder tab and it will show up here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 24 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, fontWeight: "500", textAlign: "center", lineHeight: 20 },
});

export default AppliedEmpty;
