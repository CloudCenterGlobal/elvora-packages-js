import type { GlobalConfig } from "payload";

const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  label: "Homepage Settings",
  admin: {
    group: "Blog",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "featuredStories",
      label: "Featured Stories",
      type: "relationship",
      relationTo: "blogs",
      hasMany: true,
      filterOptions: {
        published: { equals: true },
      },
      admin: {
        description:
          "Stories shown in the homepage highlights. Drag to reorder. Pick up to 6 to show them all, or more than 6 to show a random 6 that rotate every 5 minutes. Leave empty to show the 6 most recent published stories.",
      },
    },
  ],
};

export default HomepageSettings;
