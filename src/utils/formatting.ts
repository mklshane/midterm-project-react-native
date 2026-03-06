import { Job } from "../types";

/**
 * Formats a job's salary range into a human-readable currency string.
 * Returns null when neither minSalary nor maxSalary is available.
 */
export const formatSalary = (job: Pick<Job, "minSalary" | "maxSalary" | "currency">): string | null => {
  if (!job.minSalary && !job.maxSalary) return null;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: job.currency || "USD",
    maximumFractionDigits: 0,
  });

  if (job.minSalary && job.maxSalary) {
    return `${formatter.format(job.minSalary)} - ${formatter.format(job.maxSalary)}`;
  }

  return formatter.format((job.minSalary || job.maxSalary) as number);
};

/**
 * Returns a relative "X days ago" string from an epoch-seconds timestamp.
 */
export const getDaysAgoFromEpoch = (epochSeconds: number): string => {
  const days = Math.floor((Date.now() / 1000 - epochSeconds) / 86400);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

/**
 * Returns a relative "X days ago" string from a millisecond timestamp.
 */
export const getDaysAgoFromMs = (ms: number): string => {
  const days = Math.floor((Date.now() - ms) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

/**
 * Formats an epoch-seconds timestamp into a localized date string (e.g., "Mar 6, 2026").
 * Returns "N/A" when the value is falsy.
 */
export const formatEpochDate = (epochSeconds?: number): string => {
  if (!epochSeconds) return "N/A";
  return new Date(epochSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats a millisecond timestamp into a localized date string (e.g., "Mar 6, 2026").
 */
export const formatMsDate = (ms: number, includeYear = true): string => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (includeYear) options.year = "numeric";
  return new Date(ms).toLocaleDateString("en-US", options);
};

/**
 * Extracts unique non-empty values for a given field from a list of jobs.
 */
export const getUniqueJobValues = <K extends keyof Job>(jobs: Job[], field: K): string[] => {
  const values = new Set<string>();
  jobs.forEach((job) => {
    const val = job[field];
    if (val && typeof val === "string") values.add(val);
  });
  return Array.from(values);
};
