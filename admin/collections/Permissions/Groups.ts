import type { CollectionConfig } from "payload";

export const PermissionsGroup: CollectionConfig = {
  slug: "permissions-groups",
  admin: {
    useAsTitle: "name",
    description: "Permission groups are used to group permissions together. This is useful for assigning multiple permissions to a user at once.",
    defaultColumns: ["name", "permissions", "isSystem"],
  },
  labels: {
    singular: "Permission Group",
    plural: "Permission Groups",
  },
  fields: [
    {
      type: "text",
      name: "name",
      label: "Name",
      required: true,
      unique: true,
    },
    {
      type: "relationship",
      name: "permissions",
      label: "Permissions",
      relationTo: "permissions",
      hasMany: true,
      required: true,
    },
    {
      type: "checkbox",
      name: "isSystem",
      label: "Is System",
      defaultValue: false,
      access: {
        update: () => false,
      },
      admin: {
        description: "If checked, this group cannot be deleted or modified and is used internally by the system.",
        readOnly: true,
      },
    },
  ],
};
