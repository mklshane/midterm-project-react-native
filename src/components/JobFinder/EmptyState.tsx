import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeColors } from "../../styles/colors";

interface Props {
  loading: boolean;
  error: string | null;
  colors: ThemeColors;
}

const EmptyState: React.FC<Props> = ({ loading, error, colors }) => {
  return (
    <View style={styles.centerContainer}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : (
        <Text style={[styles.emptyText, { color: colors.mutedText }]}>No jobs match your criteria.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: { paddingVertical: 60, alignItems: "center" },
  errorText: { fontSize: 14, fontWeight: "500" },
  emptyText: { fontSize: 15 },
});

export default EmptyState;
