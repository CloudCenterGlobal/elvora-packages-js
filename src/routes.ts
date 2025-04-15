import qs from "qs";
import { joinPaths } from "./utils/urls";

export const careers = {
  root: "/careers/",
  detail(uuid: string, application_success?: boolean) {
    return joinPaths("/careers", uuid, application_success ? "?application_success=true" : "");
  },
  assessment(uuid: string, application_id?: string | number) {
    return joinPaths("/careers", uuid, "assessment", application_id ? `?${qs.stringify({ application_id })}` : "");
  },
  applicationSuccess: "/careers/application-success/",
} as const;

export const admin = {
  collections: {
    jobApplications: {
      detailById(id: string | number) {
        return joinPaths("/admin/collections/job-applications", id);
      },
    },
  },
};

export const termsAndConditions = {
  root: "/terms-and-conditions/",
};

export const privacyPolicy = {
  root: "/privacy-policy/",
};

export const baseRoutes = {
  careers: careers,
  admin: admin,
  termsAndConditions: termsAndConditions,
  privacyPolicy: privacyPolicy,
};
