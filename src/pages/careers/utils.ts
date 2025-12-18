import { JobPosting } from "@elvora/types";

export const isJobOpenForApplications = (job: JobPosting) => {
  if (job.job_expiration) {
    const expirationDate = new Date(job.job_expiration);
    expirationDate.setHours(23, 59, 59, 999);

    return new Date() > expirationDate;
  }

  return job.status === "published";
};
