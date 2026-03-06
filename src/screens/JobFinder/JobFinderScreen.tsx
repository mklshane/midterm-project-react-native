import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, RootTabParamList } from "../../navigation/props";
import { useJobs } from "../../contexts/JobsContext";
import { Job } from "../../types";
import { useTheme } from "../../contexts/ThemeContext";
import { useSavedJobs } from "../../contexts/SavedJobContext";
import JobCard from "../../components/JobCard";
import HeaderSection from "../../components/JobFinder/HeaderSection";
import EmptyState from "../../components/JobFinder/EmptyState";
import FilterModal, { JobFilters } from "../../components/JobFinder/FilterModal";
import DeleteConfirmModal from "../../components/AppliedJobs/DeleteConfirmModal";
import { styles } from "./JobFinder.styles";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Find">,
  NativeStackScreenProps<RootStackParamList>
>;

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, loadingMore, error, totalCount, hasMore, loadMoreJobs } = useJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { removeJob } = useSavedJobs();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    salarySort: null,
    jobType: null,
    workModel: null,
    seniorityLevel: null,
  });
  const onEndReachedCalledDuringMomentum = useRef(true);
  const listRef = useRef<FlatList<Job>>(null);

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

  const displayCount = isFiltering ? filteredJobs.length : totalCount;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>      
      <FlatList
        ref={listRef}
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.listContent}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          if (offsetY > 700 && !showScrollTop) {
            setShowScrollTop(true);
          } else if (offsetY <= 700 && showScrollTop) {
            setShowScrollTop(false);
          }
        }}
        scrollEventThrottle={16}
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
            filteredCount={displayCount}
            onOpenFilters={() => setIsFilterModalVisible(true)}
            hasActiveFilters={hasActiveFilters}
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
          />
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate("JobDetails", { job: item })}
            onRemove={(guid) => setPendingRemoveId(guid)}
          />
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

      {showScrollTop ? (
        <Pressable
          style={[styles.scrollTopButton, { backgroundColor: colors.primary }]}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Ionicons name="arrow-up" size={18} color={colors.buttonText} />
          <Text style={[styles.scrollTopLabel, { color: colors.buttonText }]}>Top</Text>
        </Pressable>
      ) : null}

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

      <DeleteConfirmModal
        visible={!!pendingRemoveId}
        colors={colors}
        title="Unsave this job?"
        message="This will remove it from your saved list. You can always save it again later."
        confirmLabel="Unsave"
        icon="bookmark-outline"
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={() => {
          if (pendingRemoveId) removeJob(pendingRemoveId);
          setPendingRemoveId(null);
        }}
      />
    </SafeAreaView>
  );
};

export default JobFinderScreen;
