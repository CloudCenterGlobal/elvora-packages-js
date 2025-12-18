import { JobPosting } from "@elvora/types";

export const getStartOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const isJobOpenForApplications = (job: JobPosting) => {
  if (job.job_expiration) {
    const expirationDate = new Date(job.job_expiration);
    return expirationDate >= getStartOfDay();
  }

  return job.status === "published";
};
