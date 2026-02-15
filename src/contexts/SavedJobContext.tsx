import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Job } from "./JobsContext";

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

  // Load saved jobs from storage
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
        // ignore
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

  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.some((j) => j.id === jobId),
    [savedJobs],
  );

  const saveJob = useCallback((job: Job) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      if (exists) return prev;

      return [job, ...prev];
    });
  }, []);

  const removeJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
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
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);

export default SavedJobsContext;
