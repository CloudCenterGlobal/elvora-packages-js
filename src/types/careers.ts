import { JobLocation, JobPosting } from "@elvora/types/payload";

export type JobPostingMini = Pick<JobPosting, "uuid" | "role" | "createdAt" | "details"> & {
  metadata: JobPosting["metadata"] & {
    job_location: JobLocation;
  };
};


declare module "./payload"{
  export type JobFormValues = JobForm['form']
}
