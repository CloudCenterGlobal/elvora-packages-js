import { JobPosting } from "@elvora/types";

export const isJobOpenForApplications = (job: JobPosting) => {
  // Check if job has an expiration date
  if (job.job_expiration) {
    const expirationDate = new Date(job.job_expiration);
    expirationDate.setHours(23, 59, 59, 999); // Set to end of the day
    const now = new Date();
    return expirationDate >= now;
  }
  return job.status === "published";
};
