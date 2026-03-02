import React from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../../navigation/props";
import { useSavedJobs } from "../../contexts/SavedJobContext";
import { useTheme } from "../../contexts/ThemeContext";
import JobCard from "../../components/JobCard";
import ThemeToggle from "../../components/Base/ThemeToggle";
import { styles } from "./SavedJobs.styles";

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

export default SavedJobsScreen;
