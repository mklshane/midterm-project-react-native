import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

export interface ApiJob {
  guid: string; 
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
  id: string; 
}

interface JobsApiResponse {
  jobs: ApiJob[];
  offset?: number;
  limit?: number;
  total_count?: number;
}

interface JobsContextProps {
  jobs: Job[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  refetchJobs: () => Promise<void>;
  loadMoreJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextProps>({
  jobs: [],
  loading: false,
  loadingMore: false,
  error: null,
  totalCount: 0,
  hasMore: false,
  refetchJobs: async () => {},
  loadMoreJobs: async () => {},
});

const API_URL = "https://empllo.com/api/v1";
const PAGE_LIMIT = 100;

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [nextOffset, setNextOffset] = useState(0);

  const fetchJobsPage = useCallback(async (offset: number) => {
    const { data } = await axios.get<JobsApiResponse>(API_URL, {
      params: { offset, limit: PAGE_LIMIT },
    });
    return data;
  }, []);

  const mergeJobs = useCallback((existingJobs: Job[], incomingApiJobs: ApiJob[]): Job[] => {
    const jobsByGuid = new Map(existingJobs.map((job) => [job.guid, job]));

    incomingApiJobs.forEach((apiJob) => {
      const existing = jobsByGuid.get(apiJob.guid);
      jobsByGuid.set(apiJob.guid, {
        ...apiJob,
        id: existing?.id ?? uuidv4(),
      });
    });

    return Array.from(jobsByGuid.values());
  }, []);

  const refetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchJobsPage(0);
      const apiJobs = Array.isArray(data.jobs) ? data.jobs : [];
      const pageLimit = typeof data.limit === "number" ? data.limit : PAGE_LIMIT;
      const apiTotalCount = typeof data.total_count === "number" ? data.total_count : apiJobs.length;

      setJobs(
        apiJobs.map((job) => ({
          ...job,
          id: uuidv4(),
        })),
      );
      setTotalCount(apiTotalCount);
      setNextOffset(pageLimit);
      setHasMore(apiJobs.length > 0 && apiJobs.length < apiTotalCount);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong while fetching jobs.");
      setJobs([]);
      setTotalCount(0);
      setNextOffset(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchJobsPage]);

  const loadMoreJobs = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const data = await fetchJobsPage(nextOffset);
      const apiJobs = Array.isArray(data.jobs) ? data.jobs : [];
      const pageLimit = typeof data.limit === "number" ? data.limit : PAGE_LIMIT;
      const apiTotalCount = typeof data.total_count === "number" ? data.total_count : totalCount;

      setJobs((previousJobs) => {
        const merged = mergeJobs(previousJobs, apiJobs);
        setHasMore(apiJobs.length > 0 && merged.length < apiTotalCount);
        return merged;
      });

      setTotalCount(apiTotalCount);
      setNextOffset((previousOffset) => previousOffset + pageLimit);

      if (apiJobs.length === 0) {
        setHasMore(false);
      }
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong while fetching more jobs.");
    } finally {
      setLoadingMore(false);
    }
  }, [fetchJobsPage, hasMore, loading, loadingMore, mergeJobs, nextOffset, totalCount]);

  useEffect(() => {
    refetchJobs();
  }, [refetchJobs]);

  const value = useMemo(
    () => ({ jobs, loading, loadingMore, error, totalCount, hasMore, refetchJobs, loadMoreJobs }),
    [jobs, loading, loadingMore, error, totalCount, hasMore, refetchJobs, loadMoreJobs],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = () => useContext(JobsContext);
export default JobsContext;
