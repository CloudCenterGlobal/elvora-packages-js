import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    group: "Users",
  },
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      name: "bio",
      label: "Bio",
      type: "text",
      required: false,
    },
    {
      name: "avatar",
      label: "Profile Image",
      type: "upload",
      relationTo: "profile-images",
      required: false,
      hasMany: false,
      displayPreview: true,
    },
  ],
  custom: {
    depth: 1,
  },
};
