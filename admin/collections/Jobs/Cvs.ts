import { createMediaCollection } from "collections/Media";
import type { CollectionConfig } from "payload";

const JobCvs: CollectionConfig = createMediaCollection({
  slug: "job-cvs",
  admin: {},
  fields: [],
  upload: {
    mimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    staticDir: "public/media/cvs",
    staticURL: "/media/cvs",
  },
});

export default JobCvs;
