import { CollectionConfig } from "payload";

const BlogTags: CollectionConfig = {
  slug: "blog-tags",
  admin: {
    group: "Blog",
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
  access: {
    create: () => true,
    read: () => true,
    update: () => false,
    delete: () => true,
  },
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
};

export default BlogTags;
