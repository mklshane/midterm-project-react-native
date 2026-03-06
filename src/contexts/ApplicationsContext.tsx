import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Application, Job } from "../types";

const STORAGE_KEY = "applied-jobs";

type ApplicationsContextValue = {
  applications: Application[];
  hydrated: boolean;
  addApplication: (job: Job, form: Omit<Application, "id" | "job" | "submittedAt">) => void;
  removeApplication: (id: string) => void;
  clearApplications: () => void;
  isApplied: (id: string) => boolean;
};

const ApplicationsContext = createContext<ApplicationsContextValue>({
  applications: [],
  hydrated: false,
  addApplication: () => {},
  removeApplication: () => {},
  clearApplications: () => {},
  isApplied: () => false,
});

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate applications from local storage when the provider mounts.
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setApplications(parsed);
        }
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  // Persist application updates after initial hydration.
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(applications)).catch(() => {});
  }, [applications, hydrated]);

  // Check whether a job has already been applied for.
  const isApplied = useCallback(
    (id: string) => applications.some((app) => app.id === id),
    [applications],
  );

  // Create or replace an application using the job guid as the id.
  const addApplication = useCallback(
    (job: Job, form: Omit<Application, "id" | "job" | "submittedAt">) => {
      setApplications((prev) => {
        const next: Application = {
          id: job.guid,
          job,
          name: form.name,
          email: form.email,
          contact: form.contact,
          coverLetter: form.coverLetter,
          submittedAt: Date.now(),
        };
        const existingIndex = prev.findIndex((a) => a.id === job.guid);
        if (existingIndex >= 0) {
          const clone = [...prev];
          clone[existingIndex] = next;
          return clone;
        }
        return [next, ...prev];
      });
    },
    [],
  );

  // Remove an application by id.
  const removeApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Clear all applications.
  const clearApplications = useCallback(() => setApplications([]), []);

  const value = useMemo(
    () => ({ applications, hydrated, addApplication, removeApplication, clearApplications, isApplied }),
    [applications, hydrated, addApplication, removeApplication, clearApplications, isApplied],
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
};

export const useApplications = () => useContext(ApplicationsContext);
export default ApplicationsContext;
