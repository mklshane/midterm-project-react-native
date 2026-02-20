import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../../styles/colors";

export type SalarySort = "highest" | "lowest" | null;

export type JobFilters = {
  salarySort: SalarySort;
  jobType: string | null;
  workModel: string | null;
  seniorityLevel: string | null;
};

interface FilterModalProps {
  visible: boolean;
  colors: ThemeColors;
  filters: JobFilters;
  jobTypeOptions: string[];
  workModelOptions: string[];
  seniorityOptions: string[];
  onClose: () => void;
  onChange: (next: JobFilters) => void;
  onReset: () => void;
}

interface FilterOptionGroupProps {
  title: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  colors: ThemeColors;
}

const FilterOptionGroup: React.FC<FilterOptionGroupProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  colors,
}) => {
  return (
    <View style={styles.groupContainer}>
      <Text style={[styles.groupTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.optionsWrap}>
        <Pressable
          style={[
            styles.optionChip,
            {
              borderColor: selectedValue === null ? colors.text : colors.border,
              backgroundColor: selectedValue === null ? colors.text : colors.background,
            },
          ]}
          onPress={() => onSelect(null)}
        >
          <Text
            style={[
              styles.optionText,
              { color: selectedValue === null ? colors.background : colors.text },
            ]}
          >
            All
          </Text>
        </Pressable>

        {options.map((option) => {
          const selected = selectedValue === option;
          return (
            <Pressable
              key={option}
              style={[
                styles.optionChip,
                {
                  borderColor: selected ? colors.text : colors.border,
                  backgroundColor: selected ? colors.text : colors.background,
                },
              ]}
              onPress={() => onSelect(option)}
            >
              <Text style={[styles.optionText, { color: selected ? colors.background : colors.text }]}> 
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  colors,
  filters,
  jobTypeOptions,
  workModelOptions,
  seniorityOptions,
  onClose,
  onChange,
  onReset,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator contentContainerStyle={styles.scrollBody}>
            <View style={styles.groupContainer}>
              <Text style={[styles.groupTitle, { color: colors.text }]}>Salary</Text>
              <View style={styles.optionsWrap}>
                <Pressable
                  style={[
                    styles.optionChip,
                    {
                      borderColor: filters.salarySort === null ? colors.text : colors.border,
                      backgroundColor: filters.salarySort === null ? colors.text : colors.background,
                    },
                  ]}
                  onPress={() => onChange({ ...filters, salarySort: null })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: filters.salarySort === null ? colors.background : colors.text },
                    ]}
                  >
                    All
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionChip,
                    {
                      borderColor: filters.salarySort === "highest" ? colors.text : colors.border,
                      backgroundColor: filters.salarySort === "highest" ? colors.text : colors.background,
                    },
                  ]}
                  onPress={() => onChange({ ...filters, salarySort: "highest" })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: filters.salarySort === "highest" ? colors.background : colors.text },
                    ]}
                  >
                    Highest salary
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionChip,
                    {
                      borderColor: filters.salarySort === "lowest" ? colors.text : colors.border,
                      backgroundColor: filters.salarySort === "lowest" ? colors.text : colors.background,
                    },
                  ]}
                  onPress={() => onChange({ ...filters, salarySort: "lowest" })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: filters.salarySort === "lowest" ? colors.background : colors.text },
                    ]}
                  >
                    Lowest salary
                  </Text>
                </Pressable>
              </View>
            </View>

            <FilterOptionGroup
              title="Job type"
              options={jobTypeOptions}
              selectedValue={filters.jobType}
              onSelect={(jobType) => onChange({ ...filters, jobType })}
              colors={colors}
            />

            <FilterOptionGroup
              title="Work model"
              options={workModelOptions}
              selectedValue={filters.workModel}
              onSelect={(workModel) => onChange({ ...filters, workModel })}
              colors={colors}
            />

            <FilterOptionGroup
              title="Seniority"
              options={seniorityOptions}
              selectedValue={filters.seniorityLevel}
              onSelect={(seniorityLevel) => onChange({ ...filters, seniorityLevel })}
              colors={colors}
            />
          </ScrollView>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={onReset}
            >
              <Text style={[styles.actionText, { color: colors.text }]}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.text }]}
              onPress={onClose}
            >
              <Text style={[styles.actionText, { color: colors.background }]}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: "85%",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  scrollBody: {
    paddingBottom: 10,
  },
  groupContainer: {
    marginTop: 10,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default FilterModal;
