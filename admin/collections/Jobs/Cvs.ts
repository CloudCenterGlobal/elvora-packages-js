import { createCollection } from "@elvora/utils/payload";
import { createMediaCollection } from "collections/Media";

const JobCvs = createCollection(
  createMediaCollection({
    slug: "job-cvs",
    fields: [],
    upload: {
      mimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      staticDir: "public/media/cvs",
      staticURL: "/media/cvs",
    },
  })
);

export default JobCvs;
