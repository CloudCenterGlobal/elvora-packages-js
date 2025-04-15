import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { CollectionBeforeValidateHook } from "payload";
import slugify from "slugify";

const beforeValidate: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (data) {
    data.slug = slugify(data.title ?? "", {
      lower: true,
    });
  }

  return data;
};

const Blogs = createCollection({
  slug: "blogs",
  admin: {
    useAsTitle: "title",
    description: "Manage blog posts",
    enableRichTextRelationship: true,
    defaultColumns: ["title", "thumbnail", "author", "published", "createdAt", "categories"],
  },

  hooks: {
    beforeValidate: [beforeValidate],
  },

  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: false,
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "This will be automatically generated from the title once the blog post is saved.",
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "upload",
      relationTo: "blog-images",
      required: true,
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        description: "Author of the blog post. This will be displayed on the blog post.",
        position: "sidebar",
      },
    },
    {
      name: "categories",
      label: "Categories",
      type: "relationship",
      relationTo: "blog-categories",
      required: true,
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Categories of the blog post. Recommended to add at least one category.",
      },
    },
    {
      name: "tags",
      label: "Tags",
      type: "relationship",
      relationTo: "blog-tags",
      required: true,
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "published",
      label: "Publish",
      type: "checkbox",
      defaultValue: true,
      required: false,
      admin: {
        position: "sidebar",
        description: "Check this box to publish the blog post.",
      },
    },
  ],
});

export default Blogs;
