import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../navigation/props";
import { useJobs, Job } from "../contexts/JobsContext";
import { useTheme } from "../contexts/ThemeContext";
import JobCard from "../components/JobCard";
import HeaderSection from "../components/JobFinder/HeaderSection";
import EmptyState from "../components/JobFinder/EmptyState";
import FilterModal, { JobFilters } from "../components/JobFinder/FilterModal";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Find">,
  NativeStackScreenProps<RootStackParamList>
>;

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, loadingMore, error, hasMore, loadMoreJobs } = useJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    salarySort: null,
    jobType: null,
    workModel: null,
    seniorityLevel: null,
  });
  const onEndReachedCalledDuringMomentum = useRef(true);

  const resetFilters = () => {
    setFilters({ salarySort: null, jobType: null, workModel: null, seniorityLevel: null });
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((job) => {
      if (job.mainCategory) cats.add(job.mainCategory);
    });
    return Array.from(cats).slice(0, 5);
  }, [jobs]);

  const jobTypeOptions = useMemo(() => {
    const values = new Set<string>();
    jobs.forEach((job) => {
      if (job.jobType) values.add(job.jobType);
    });
    return Array.from(values);
  }, [jobs]);

  const workModelOptions = useMemo(() => {
    const values = new Set<string>();
    jobs.forEach((job) => {
      if (job.workModel) values.add(job.workModel);
    });
    return Array.from(values);
  }, [jobs]);

  const seniorityOptions = useMemo(() => {
    const values = new Set<string>();
    jobs.forEach((job) => {
      if (job.seniorityLevel) values.add(job.seniorityLevel);
    });
    return Array.from(values);
  }, [jobs]);

  const hasActiveFilters =
    filters.salarySort !== null ||
    filters.jobType !== null ||
    filters.workModel !== null ||
    filters.seniorityLevel !== null;

  const activeFilters = useMemo(() => {
    const chips: Array<{ key: string; label: string }> = [];

    if (selectedCategory) {
      chips.push({ key: "category", label: `Category: ${selectedCategory}` });
    }
    if (filters.salarySort) {
      chips.push({
        key: "salarySort",
        label: filters.salarySort === "highest" ? "Salary: Highest" : "Salary: Lowest",
      });
    }
    if (filters.jobType) {
      chips.push({ key: "jobType", label: `Type: ${filters.jobType}` });
    }
    if (filters.workModel) {
      chips.push({ key: "workModel", label: `Model: ${filters.workModel}` });
    }
    if (filters.seniorityLevel) {
      chips.push({ key: "seniorityLevel", label: `Seniority: ${filters.seniorityLevel}` });
    }

    return chips;
  }, [selectedCategory, filters]);

  const handleRemoveFilter = (key: string) => {
    if (key === "category") {
      setSelectedCategory(null);
      return;
    }

    setFilters((previous) => ({
      ...previous,
      [key]: null,
    }));
  };

  const isFiltering = Boolean(search || selectedCategory || hasActiveFilters);

  const getComparableSalary = (job: Job) => {
    if (typeof job.maxSalary === "number") return job.maxSalary;
    if (typeof job.minSalary === "number") return job.minSalary;
    return null;
  };

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
      filtered = filtered.filter((job: Job) => job.mainCategory === selectedCategory);
    }

    if (filters.jobType) {
      filtered = filtered.filter((job: Job) => job.jobType === filters.jobType);
    }

    if (filters.workModel) {
      filtered = filtered.filter((job: Job) => job.workModel === filters.workModel);
    }

    if (filters.seniorityLevel) {
      filtered = filtered.filter((job: Job) => job.seniorityLevel === filters.seniorityLevel);
    }

    if (filters.salarySort) {
      filtered = [...filtered].sort((firstJob, secondJob) => {
        const firstSalary = getComparableSalary(firstJob);
        const secondSalary = getComparableSalary(secondJob);

        if (firstSalary === null && secondSalary === null) return 0;
        if (firstSalary === null) return 1;
        if (secondSalary === null) return -1;

        return filters.salarySort === "highest"
          ? secondSalary - firstSalary
          : firstSalary - secondSalary;
      });
    }

    return filtered;
  }, [search, selectedCategory, jobs, filters]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReached={() => {
          if (onEndReachedCalledDuringMomentum.current) return;

          if (!loading && !loadingMore && hasMore && !isFiltering && jobs.length > 0) {
            loadMoreJobs();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        ListHeaderComponent={
          <HeaderSection
            colors={colors}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            search={search}
            onSearchChange={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={loading}
            error={error}
            filteredCount={filteredJobs.length}
            onOpenFilters={() => setIsFilterModalVisible(true)}
            hasActiveFilters={hasActiveFilters}
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
          />
        }
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => navigation.navigate("JobDetails", { job: item })} />
        )}
        ListEmptyComponent={() => (
          <EmptyState loading={loading} error={error} colors={colors} />
        )}
        ListFooterComponent={
          loadingMore && !isFiltering && filteredJobs.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />

      <FilterModal
        visible={isFilterModalVisible}
        colors={colors}
        filters={filters}
        jobTypeOptions={jobTypeOptions}
        workModelOptions={workModelOptions}
        seniorityOptions={seniorityOptions}
        onClose={() => setIsFilterModalVisible(false)}
        onChange={setFilters}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 4, paddingTop: 20 },
  footerLoader: { paddingVertical: 16 },
});

export default JobFinderScreen;
