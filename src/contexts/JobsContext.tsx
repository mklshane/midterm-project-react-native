import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ works in React Native now
import "react-native-get-random-values"; // polyfill crypto

export interface ApiJob {
  guid: string; // Using guid as the unique ID
  title: string;
  mainCategory: string;
  companyName: string;
  companyLogo: string | null;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  locations: string[];
  tags: string[];
  description: string;
  pubDate: number;
  expiryDate: number;
  applicationLink: string;
}

export interface Job extends ApiJob {
  id: string; // generated uuid
}

interface JobsApiResponse {
  jobs: ApiJob[];
}

interface JobsContextProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refetchJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextProps>({
  jobs: [],
  loading: false,
  error: null,
  refetchJobs: async () => {},
});

const API_URL = "https://empllo.com/api/v1";

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapJobsWithIds = useCallback((apiJobs: ApiJob[]): Job[] => {
    return apiJobs.map((job) => ({
      ...job,
      id: uuidv4(), // ✅ works now with get-random-values polyfill
    }));
  }, []);

  const refetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = (await res.json()) as JobsApiResponse;
      const apiJobs = Array.isArray(data.jobs) ? data.jobs : [];
      const mapped = mapJobsWithIds(apiJobs);
      setJobs(mapped);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong while fetching jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [mapJobsWithIds]);

  useEffect(() => {
    refetchJobs();
  }, [refetchJobs]);

  const value = useMemo(
    () => ({ jobs, loading, error, refetchJobs }),
    [jobs, loading, error, refetchJobs],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = () => useContext(JobsContext);
export default JobsContext;
