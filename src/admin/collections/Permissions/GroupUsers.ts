import { createCollection } from "@elvora/admin/collections/Permissions/helpers";

export const GroupUsers = createCollection({
  slug: "permission-group-users",
  admin: {
    useAsTitle: "user",
    defaultColumns: ["user", "group"],
    description: "Group users are used to assign users to permission groups.",
  },
  labels: {
    singular: "Group User",
    plural: "Group Users",
  },
  fields: [
    {
      type: "relationship",
      name: "user",
      label: "User",
      relationTo: "users",
      required: true,
    },
    {
      type: "relationship",
      name: "group",
      label: "Group",
      relationTo: "permissions-groups",
      required: true,
    },
  ],
});
