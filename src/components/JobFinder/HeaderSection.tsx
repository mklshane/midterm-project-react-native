import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggle from "../Base/ThemeToggle";
import { ThemeColors } from "../../styles/colors";

interface Props {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  loading: boolean;
  error: string | null;
  filteredCount: number;
  onOpenFilters: () => void;
  hasActiveFilters: boolean;
  activeFilters: Array<{ key: string; label: string }>;
  onRemoveFilter: (key: string) => void;
}

const HeaderSection: React.FC<Props> = ({
  colors,
  isDarkMode,
  toggleTheme,
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  loading,
  error,
  filteredCount,
  onOpenFilters,
  hasActiveFilters,
  activeFilters,
  onRemoveFilter,
}) => {
  const categoryItems = ["All", ...categories];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.mainHeader, { color: colors.text }]}>Find work.</Text>
          <Text style={[styles.subHeader, { color: colors.mutedText }]}>Discover your next role</Text>
        </View>
        <ThemeToggle isDarkMode={isDarkMode} color={colors.text} onToggle={toggleTheme} />
      </View>

      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.mutedText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search roles, companies..."
            placeholderTextColor={colors.mutedText}
            value={search}
            onChangeText={onSearchChange}
          />
          {search ? (
            <Pressable
              onPress={() => onSearchChange("")}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close-circle" size={18} color={colors.mutedText} />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          style={[
            styles.filterButton,
            {
              borderColor: hasActiveFilters ? colors.text : colors.border,
              backgroundColor: hasActiveFilters ? colors.text : colors.surface,
            },
          ]}
          onPress={onOpenFilters}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={hasActiveFilters ? colors.background : colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryItems}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item || (item === "All" && !selectedCategory);
            return (
              <Pressable
                style={[
                  styles.categoryTab,
                  {
                    borderColor: isActive ? colors.text : colors.border,
                    backgroundColor: isActive ? colors.text : colors.surface,
                  },
                ]}
                onPress={() => onCategoryChange(item === "All" ? null : item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isActive ? colors.background : colors.text,
                      fontWeight: isActive ? "700" : "600",
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {activeFilters.length > 0 && (
        <View style={styles.activeFiltersWrap}>
          {activeFilters.map((filter) => (
            <View
              key={filter.key}
              style={[
                styles.activeFilterChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.activeFilterText, { color: colors.text }]}>{filter.label}</Text>
              <Pressable
                onPress={() => onRemoveFilter(filter.key)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="close" size={14} color={colors.mutedText} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {!loading && !error && (
        <Text style={[styles.countText, { color: colors.mutedText }]}>
          {filteredCount} {filteredCount === 1 ? "result" : "results"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 14 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  mainHeader: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  subHeader: { fontSize: 13, fontWeight: "500", marginTop: 2 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, height: "100%" },
  categoriesWrapper: { marginBottom: 14 },
  activeFiltersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  activeFilterText: { fontSize: 12, fontWeight: "600" },
  categoryTab: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 36,
  },
  categoryText: { fontSize: 13 },
  countText: { fontSize: 12, fontWeight: "600", marginBottom: 8 },
});

export default HeaderSection;
