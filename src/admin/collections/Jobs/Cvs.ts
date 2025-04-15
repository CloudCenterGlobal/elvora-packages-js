import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { createMediaCollection } from "../Media";

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
