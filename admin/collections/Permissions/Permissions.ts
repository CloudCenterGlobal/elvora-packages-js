import type { CollectionConfig } from "payload";

export const Permissions: CollectionConfig = {
  slug: "permissions",
  admin: {
    useAsTitle: "description",
    description:
      "Permissions are used to control access to different parts of the system. They are used in conjunction with permission groups to determine what a user can do.",
    defaultColumns: ["description", "createdAt", "updatedAt"],
  },
  access: {
    create: () => false,
    update: () => false,
    delete: () => false,
    read: () => true,
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
};
