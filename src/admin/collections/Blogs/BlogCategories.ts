import { createCollection } from "@elvora/admin/collections/Permissions/helpers";

const BlogCategories = createCollection({
  slug: "blog-categories",
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
    {
      name: "slug",
      label: "Slug",
      type: "text",
      unique: true,
      access: {
        create: () => false,
        update: () => false,
      },
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
});

export default BlogCategories;
