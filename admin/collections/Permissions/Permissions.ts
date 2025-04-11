import { createCollection } from "@elvora/utils/payload";

export const Permissions = createCollection({
  slug: "permissions",
  admin: {
    useAsTitle: "description",
    description:
      "Permissions are used to control access to different parts of the system. They are used in conjunction with permission groups to determine what a user can do.",
    defaultColumns: ["description", "createdAt", "updatedAt"],
  },
  disableDuplicate: true,
  fields: [
    {
      name: "key",
      label: "Key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Unique. This will be used in the code.",
      },
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
      admin: {
        description: "This will be displayed in the admin panel.",
      },
    },
  ],
});
