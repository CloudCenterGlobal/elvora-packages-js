import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import slugify from "slugify";

const ServiceUsers = createCollection({
  slug: "service-users",
  admin: {
    useAsTitle: "name",
    description: "People we support. Link a blog post to one to show only one story per service user on the homepage.",
  },
  labels: {
    singular: "Service User",
    plural: "Service Users",
  },
  fields: [
    {
      name: "name",
      label: "Initial",
      type: "text",
      maxLength: 3,
      unique: true,
      required: true,
      admin: {
        description: "Use the service user's initial only. Do not enter their full name.",
      },
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      unique: true,
      admin: {
        disabled: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data) {
          data.slug = slugify(data.slug || data.name || "", { lower: true, strict: true });
        }
        return data;
      },
    ],
  },
});

export default ServiceUsers;
