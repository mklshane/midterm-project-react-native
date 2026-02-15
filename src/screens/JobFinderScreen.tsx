import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useJobs, Job } from "../contexts/JobsContext";
import { useTheme } from "../contexts/ThemeContext";
import JobCard from "../components/JobCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/props";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggle from "../components/ThemeToggle";

type Props = NativeStackScreenProps<RootStackParamList, "Find">;

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, error } = useJobs();
  // Destructure isDarkMode and toggleTheme from your context
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((job) => {
      if (job.mainCategory) cats.add(job.mainCategory);
    });
    return Array.from(cats).slice(0, 5);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (job: Job) =>
          job.title.toLowerCase().includes(lower) ||
          job.companyName.toLowerCase().includes(lower) ||
          (job.mainCategory && job.mainCategory.toLowerCase().includes(lower)),
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (job: Job) => job.mainCategory === selectedCategory,
      );
    }
    return filtered;
  }, [search, selectedCategory, jobs]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Top Row: Header & Theme Toggle */}
            <View style={styles.topRow}>
              <Text style={[styles.mainHeader, { color: colors.text }]}>
                Find work.
              </Text>

              <ThemeToggle
                isDarkMode={isDarkMode}
                color={colors.text}
                onToggle={toggleTheme}
              />
            </View>

            {/* Flat, Minimal Search Bar */}
            <View
              style={[
                styles.searchBox,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="search"
                size={18}
                color={colors.mutedText}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search roles, companies..."
                placeholderTextColor={colors.mutedText}
                value={search}
                onChangeText={setSearch}
              />
              {search ? (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.mutedText}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Clean Text-based Categories */}
            <View style={styles.categoriesWrapper}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={["All", ...categories]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isActive =
                    selectedCategory === item ||
                    (item === "All" && !selectedCategory);
                  return (
                    <TouchableOpacity
                      style={styles.categoryTab}
                      onPress={() =>
                        setSelectedCategory(item === "All" ? null : item)
                      }
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: isActive ? colors.text : colors.mutedText,
                            fontWeight: isActive ? "700" : "500",
                          },
                        ]}
                      >
                        {item}
                      </Text>
                      {/* Active Indicator Dot */}
                      {isActive && (
                        <View
                          style={[
                            styles.activeDot,
                            { backgroundColor: colors.text },
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Clean Count */}
            {!loading && !error && (
              <Text style={[styles.countText, { color: colors.mutedText }]}>
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "result" : "results"}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate("JobDetails", { job: item })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : error ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            ) : (
              <Text style={[styles.emptyText, { color: colors.mutedText }]}>
                No jobs match your criteria.
              </Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  headerContainer: { marginBottom: 16 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Aligns the text and icon nicely
    marginBottom: 24,
  },
  mainHeader: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, height: "100%" },
  categoriesWrapper: { marginBottom: 24 },
  categoryTab: { marginRight: 24, alignItems: "center" },
  categoryText: { fontSize: 15, marginBottom: 4 },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  countText: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  centerContainer: { paddingVertical: 60, alignItems: "center" },
  errorText: { fontSize: 14, fontWeight: "500" },
  emptyText: { fontSize: 15 },
});

export default JobFinderScreen;
