import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { createMediaCollection } from "../Media";

const ReferralDocuments = createCollection(
  createMediaCollection({
    slug: "forms-referral-documents",
    dbName: "forms_referral_documents",
    admin: {},
    fields: [],
    upload: {
      mimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"],
      staticDir: "public/media/forms/referral-documents",
      staticURL: "/media/forms/referral-documents",
      /**
       * The referral action writes each submission's files to disk itself
       * (into a per-submission subfolder — Payload's own upload pipeline
       * always writes flat into staticDir, no per-document subfolder
       * option) and creates this doc with filename/url/etc already set,
       * without passing Payload a `file`. Without this flag, create()
       * throws MissingFile whenever `file` isn't supplied.
       */
      filesRequiredOnCreate: false,
    },
  })
);

export default ReferralDocuments;
