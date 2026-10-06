import type { CollectionConfig, Field } from "payload";

const READ_STATUS_OPTIONS = [
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const readStatusField: Field = {
  name: "status",
  label: "Status",
  type: "select",
  options: READ_STATUS_OPTIONS,
  defaultValue: "unread",
  index: true,
  admin: {
    position: "sidebar",
    description: "Submissions start as unread. Set to read once someone has dealt with it.",
  },
};

// Submissions are immutable apart from their status, so every submitted field is read-only.
const lockFields = (fields: Field[]): Field[] =>
  fields.map((field) => {
    if (field.type === "tabs") {
      return { ...field, tabs: field.tabs.map((tab) => ({ ...tab, fields: lockFields(tab.fields) })) };
    }

    if (!("name" in field) && "fields" in field) {
      return { ...field, fields: lockFields(field.fields) };
    }

    if (!("name" in field) || field.type === "ui") {
      return field;
    }

    return {
      ...field,
      access: { ...field.access, update: () => false },
      admin: { ...field.admin, readOnly: true },
    } as Field;
  });

const withReadStatus = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  fields: [...lockFields(collection.fields), readStatusField],
});

export { READ_STATUS_OPTIONS, withReadStatus };
