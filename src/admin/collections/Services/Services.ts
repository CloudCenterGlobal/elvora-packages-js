import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import set from "lodash/set";
import slugify from "slugify";

const Services = createCollection({
  slug: "services",
  admin: {
    useAsTitle: "name",
    description: "Manage the list of services offered. These appear in the service name dropdown on the feedback form.",
    defaultColumns: ["name", "slug", "active"],
  },
  labels: {
    singular: "Service",
    plural: "Services",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      unique: true,
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from the name. Must be unique.",
        readOnly: true,
      },
    },
    {
      name: "active",
      label: "Active",
      type: "checkbox",
      defaultValue: true,
      required: false,
      admin: {
        position: "sidebar",
        description: "Only active services appear in the feedback form dropdown.",
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ operation, data }) => {
        if (data && (operation === "create" || !data?.slug)) {
          set(data, "slug", slugify(data.name ?? "", { lower: true }));
        }
        return data;
      },
    ],
  },
});

export default Services;
