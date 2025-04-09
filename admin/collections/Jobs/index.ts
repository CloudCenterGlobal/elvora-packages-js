import JobPosting from "./Job";
import JobApplications from "./JobApplications";
import { JobForms } from "./JobForms";
import JobLocations from "./JobLocations";

const JobsCollectionConfig = [JobPosting, JobLocations, JobForms, JobApplications].map((collection) => {
  collection.admin = {
    ...collection.admin,
    group: "Careers",
  };
  return collection;
});

export { JobsCollectionConfig };
