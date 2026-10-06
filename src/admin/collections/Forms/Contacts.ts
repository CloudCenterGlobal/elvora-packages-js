import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { withReadStatus } from "./readStatus";
import { formSubmissionNotificationEndpoint } from "./sendNotification";

const Contacts: CollectionConfig = createCollection({
  slug: "forms-contacts",
  dbName: "forms_contacts",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "phone", "location", "status", "createdAt"],
    description: "Enquiries submitted through the Contact form.",
    components: {
      views: {
        edit: {
          emailPreview: {
            Component: "@elvora/admin/collections/Forms/EmailPreview#FormSubmissionEmailPreview",
            path: "/email-preview",
            tab: { label: "Email preview" },
          },
        },
      },
    },
  },
  endpoints: [formSubmissionNotificationEndpoint("forms-contacts")],
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
      label: "Phone",
      type: "text",
      required: false,
    },
    {
      name: "location",
      label: "Postal code or town",
      type: "text",
      required: true,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
    },
  ],
});

export default withReadStatus(Contacts);
