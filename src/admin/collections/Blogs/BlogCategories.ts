import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import set from "lodash/set";
import slugify from "slugify";

const BlogCategories = createCollection({
  slug: "blog-categories",
  admin: {
    useAsTitle: "name",
  },
  labels: {
    singular: "Blog Category",
    plural: "Blog Categories",
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
        description: "This will be automatically generated from the name. It must be unique.",
      },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      admin: {
        description: "A short description of the category",
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ operation, data }) => {
        if (data && operation === "create" && !data?.slug) {
          set(data, "slug", slugify(data.name, { lower: true }));
        }
        return data;
      },
    ],
  },
});

export default BlogCategories;
