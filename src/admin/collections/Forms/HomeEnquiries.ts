import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";

const HomeEnquiries: CollectionConfig = createCollection({
  slug: "forms-home-enquiries",
  dbName: "forms_home_enquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "home_name", "email", "phone", "createdAt"],
    description: "Enquiries submitted from an individual home's page.",
  },
  access: {
    update: () => false,
  },
  fields: [
    {
      name: "home_name",
      label: "Home",
      type: "text",
      required: true,
    },
    {
      name: "home_slug",
      label: "Home slug",
      type: "text",
      required: true,
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
      label: "Phone",
      type: "text",
      required: false,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
    },
    {
      name: "consent",
      label: "Consented to data storage",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
  ],
});

export default HomeEnquiries;
