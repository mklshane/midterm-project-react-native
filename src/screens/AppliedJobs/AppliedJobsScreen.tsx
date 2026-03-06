import React, { useState } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../../navigation/props";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useTheme } from "../../contexts/ThemeContext";
import AppliedJobCard from "../../components/AppliedJobs/AppliedJobCard";
import AppliedEmpty from "../../components/AppliedJobs/AppliedEmpty";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import ThemeToggle from "../../components/Base/ThemeToggle";
import { styles } from "./AppliedJobs.styles";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Applied">,
  NativeStackScreenProps<RootStackParamList>
>;

const AppliedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { applications, removeApplication } = useApplications();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const pendingApplication = applications.find((a) => a.id === pendingDeleteId) || null;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Applied</Text>
        <ThemeToggle isDarkMode={isDarkMode} color={colors.text} onToggle={toggleTheme} />
      </View>

      <Text style={[styles.subtitle, { color: colors.mutedText }]}>Your submitted applications live here.</Text>

      <View style={styles.metaRow}>
        <View style={[styles.counter, { backgroundColor: colors.primaryLight }]}>        
          <Text style={[styles.counterText, { color: colors.primary }]}>
            {applications.length} {applications.length === 1 ? "application" : "applications"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: colors.background }]}>      
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <AppliedJobCard
            application={item}
            colors={colors}
            onPress={() => navigation.navigate("ApplicationDetails", { applicationId: item.id })}
            onDelete={() => setPendingDeleteId(item.id)}
          />
        )}
        ListEmptyComponent={() => <AppliedEmpty colors={colors} />}
      />

      <DeleteConfirmModal
        visible={!!pendingApplication}
        colors={colors}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) removeApplication(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </SafeAreaView>
  );
};

export default AppliedJobsScreen;
