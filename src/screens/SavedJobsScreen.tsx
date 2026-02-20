import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../navigation/props";
import { useSavedJobs } from "../contexts/SavedJobContext";
import { useTheme } from "../contexts/ThemeContext";
import JobCard from "../components/JobCard";
import ThemeToggle from "../components/Base/ThemeToggle";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Saved">,
  NativeStackScreenProps<RootStackParamList>
>;

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { savedJobs } = useSavedJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Saved jobs</Text>
        <ThemeToggle isDarkMode={isDarkMode} color={colors.text} onToggle={toggleTheme} />
      </View>

      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Keep track of roles you want to revisit.
      </Text>

      <View style={styles.metaRow}>
        <View style={[styles.counter, { backgroundColor: colors.primaryLight }]}> 
          <Text style={[styles.counterText, { color: colors.primary }]}> 
            {savedJobs.length} {savedJobs.length === 1 ? "saved job" : "saved jobs"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.guid}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() =>
              navigation.navigate("JobDetails", {
                job: item,
                fromSavedJobs: true,
              })
            }
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrapper}>
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              No saved jobs yet.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  title: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  subtitle: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  metaRow: { marginTop: 14, flexDirection: "row", alignItems: "center" },
  counter: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  counterText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
  separator: { height: 12 },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 15, fontWeight: "500" },
});

export default SavedJobsScreen;
