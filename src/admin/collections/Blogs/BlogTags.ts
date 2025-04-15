import { createCollection } from "@elvora/admin/collections/Permissions/helpers";

const BlogTags = createCollection({
  slug: "blog-tags",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      unique: true,
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ operation, data }) => {
        // @ts-expect-error data is possibly undefined
        if (operation === "create" && !data.slug) {
          // @ts-expect-error data is possibly undefined
          data.slug = data.name.toLowerCase();
        }
        return data;
      },
    ],
  },
});

export default BlogTags;
