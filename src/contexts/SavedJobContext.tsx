import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Job } from "./JobsContext";
import { useTheme } from "./ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface SavedJobsContextProps {
  savedJobs: Job[];
  hydrated: boolean;
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  clearSavedJobs: () => void;
  isJobSaved: (jobId: string) => boolean;
}

const STORAGE_KEY = "saved-jobs";

const SavedJobsContext = createContext<SavedJobsContextProps>({
  savedJobs: [],
  hydrated: false,
  saveJob: () => {},
  removeJob: () => {},
  clearSavedJobs: () => {},
  isJobSaved: () => false,
});

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { colors } = useTheme();

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<"bookmark" | "bookmark-outline">(
    "bookmark",
  );

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedJobs(parsed);
        }
      } catch {
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  // Persist saved jobs
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs)).catch(
      () => {},
    );
  }, [savedJobs, hydrated]);

  // Helper to show the 2-second toast
  const triggerToast = (
    message: string,
    icon: "bookmark" | "bookmark-outline",
  ) => {
    setToastMessage(message);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // FIXED: Changed j.id to j.guid to match your API
  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.some((j) => j.guid === jobId),
    [savedJobs],
  );

  const saveJob = useCallback((job: Job) => {
    setSavedJobs((prev) => {
      // FIXED: Changed j.id to j.guid
      const exists = prev.some((j) => j.guid === job.guid);
      if (exists) return prev;
      return [job, ...prev];
    });
    triggerToast("Job saved to your list", "bookmark");
  }, []);

  const removeJob = useCallback((jobId: string) => {
    // FIXED: Changed j.id to j.guid
    setSavedJobs((prev) => prev.filter((j) => j.guid !== jobId));
    triggerToast("Job removed", "bookmark-outline");
  }, []);

  const clearSavedJobs = useCallback(() => {
    setSavedJobs([]);
  }, []);

  const value = useMemo(
    () => ({
      savedJobs,
      hydrated,
      saveJob,
      removeJob,
      clearSavedJobs,
      isJobSaved,
    }),
    [savedJobs, hydrated, saveJob, removeJob, clearSavedJobs, isJobSaved],
  );

  return (
    <SavedJobsContext.Provider value={value}>
      {children}

      {/* The Minimalist Toast Overlay */}
      {toastMessage && (
        <View style={styles.toastContainer} pointerEvents="none">
          <View style={[styles.toastBox, { backgroundColor: colors.text }]}>
            <Ionicons
              name={toastIcon}
              size={18}
              color={colors.background}
              style={styles.toastIcon}
            />
            <Text style={[styles.toastText, { color: colors.background }]}>
              {toastMessage}
            </Text>
          </View>
        </View>
      )}
    </SavedJobsContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50, 
    zIndex: 9999,
    elevation: 9999,
  },
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  toastIcon: {
    marginRight: 8,
  },
  toastText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export const useSavedJobs = () => useContext(SavedJobsContext);
export default SavedJobsContext;
