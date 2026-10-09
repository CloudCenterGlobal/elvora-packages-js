import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { withReadStatus } from "./readStatus";
import { INVESTMENT_AREA_OPTIONS } from "./constants";
import { formSubmissionNotificationEndpoint } from "./sendNotification";

const PropertyPartners: CollectionConfig = createCollection({
  slug: "forms-property-partners",
  labels: { singular: "Property Partner Application", plural: "Property Partner Applications" },
  dbName: "forms_property_partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "phone", "call.status", "call.scheduled_at", "status", "createdAt"],
    description: "Enquiries submitted through the Supported Living Partners landing page.",
    components: {
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
      name: "property_location",
      label: "Property location",
      type: "text",
      required: false,
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
      admin: { description: "Outcome of the qualifying questions on /property-partners/apply." },
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
      name: "call",
      label: "Call booking",
      type: "group",
      admin: { description: "The call time they picked and whether it was booked in Calendly." },
      fields: [
        {
          name: "status",
          label: "Status",
          type: "select",
          index: true,
          options: [
            { label: "Booked", value: "booked" },
            { label: "Failed", value: "failed" },
            { label: "No time selected", value: "not_scheduled" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
        {
          name: "scheduled_at",
          label: "Selected time",
          type: "date",
          admin: { date: { pickerAppearance: "dayAndTime" } },
        },
        { name: "timezone", label: "Visitor timezone", type: "text" },
        { name: "failure_reason", label: "Why it failed", type: "text" },
        { name: "calendly_invitee_uri", label: "Calendly invitee", type: "text", index: true },
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
        { name: "fbclid", label: "Meta click ID (fbclid)", type: "text" },
      ],
    },
  ],
});

export default withReadStatus(PropertyPartners);
