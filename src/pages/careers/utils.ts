import { JobPosting } from "@elvora/types";

const getStartOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const isJobOpenForApplications = (job: JobPosting) => {
  // Check if job has an expiration date
  if (job.job_expiration) {
    const expirationDate = new Date(job.job_expiration);
    const startOfToday = getStartOfDay();
    // Job is open if expiration date >= start of today (midnight cutoff)
    return expirationDate >= startOfToday;
  }
  return job.status === "published";
};
