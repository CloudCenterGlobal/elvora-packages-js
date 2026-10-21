import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { withReadStatus } from "./readStatus";
import { withCustomPage } from "./withCustomPage";
import { INVESTMENT_AREA_OPTIONS, PARTNER_TYPE_OPTIONS } from "./constants";
import { formSubmissionNotificationEndpoint } from "./sendNotification";

const PropertyPartners: CollectionConfig = createCollection({
  slug: "forms-property-partners",
  labels: { singular: "Partner Application", plural: "Partner Applications" },
  dbName: "forms_property_partners",
  admin: {
    useAsTitle: "name",
    pagination: { defaultLimit: 25, limits: [10, 25, 50, 100] },
    defaultColumns: ["name", "partner_type", "email", "phone", "status", "createdAt"],
    description: "Property and housing partner applications. Filter by partner type.",
    components: {
      beforeListTable: ["@elvora/admin/collections/Forms/PartnerTypeFilter#PartnerTypeFilter"],
      views: {
        edit: {
          emailPreview: {
            Component: "@elvora/admin/collections/Forms/EmailPreview#FormSubmissionEmailPreview",
            path: "/email-preview",
            tab: { label: "Email preview", href: "/email-preview" },
          },
        },
      },
    },
  },
  endpoints: [formSubmissionNotificationEndpoint("forms-property-partners")],
  fields: [
    {
      name: "partner_type",
      label: "Partner type",
      type: "select",
      defaultValue: "property",
      index: true,
      options: [...PARTNER_TYPE_OPTIONS],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Contact number",
      type: "text",
      required: true,
    },
    {
      name: "investment_areas",
      label: "Investment areas",
      type: "text",
      hasMany: true,
      required: false,
      validate: (value: string[] | null | undefined) => {
        const known = INVESTMENT_AREA_OPTIONS.map((option) => option.value as string);
        const invalid = (value ?? []).filter((entry) => !known.includes(entry));
        return invalid.length === 0 || `Unknown investment area(s): ${invalid.join(", ")}`;
      },
    },
    {
      name: "additional_info",
      label: "Additional information",
      type: "textarea",
      required: false,
    },
    {
      name: "consent",
      label: "Consented to data storage",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "qualification",
      label: "Qualification",
      type: "group",
      admin: { description: "Outcome of the qualifying questions on the partner apply page." },
      fields: [
        { name: "form_version", label: "Question set version", type: "number" },
        {
          name: "result",
          label: "Result",
          type: "select",
          options: [
            { label: "Pass", value: "pass" },
            { label: "Decline", value: "decline" },
          ],
        },
        { name: "score", label: "Score", type: "number" },
        { name: "max_score", label: "Maximum score", type: "number" },
      ],
    },
    {
      name: "answers",
      label: "Answers",
      type: "array",
      admin: { description: "What they answered, in the wording they saw.", initCollapsed: false },
      fields: [
        { name: "step_id", label: "Question ID", type: "text", admin: { hidden: true } },
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "text" },
      ],
    },
    {
      name: "tracking",
      label: "Ad tracking",
      type: "group",
      fields: [
        { name: "utm_source", label: "UTM source", type: "text" },
        { name: "utm_campaign", label: "UTM campaign", type: "text" },
        { name: "utm_content", label: "UTM content", type: "text" },
        { name: "utm_medium", label: "UTM medium", type: "text" },
        { name: "utm_term", label: "UTM term (ad set name)", type: "text" },
        { name: "campaign_id", label: "Campaign ID", type: "text" },
        { name: "adset_id", label: "Ad set ID", type: "text" },
        { name: "ad_id", label: "Ad ID", type: "text" },
        { name: "placement", label: "Placement", type: "text" },
        { name: "fbclid", label: "Meta click ID (fbclid)", type: "text" },
      ],
    },
  ],
});

export default withReadStatus(
  withCustomPage(PropertyPartners, "@elvora/admin/collections/Forms/SubmissionPage#SubmissionPage"),
);
