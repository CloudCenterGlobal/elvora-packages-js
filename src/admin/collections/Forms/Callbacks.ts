import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { CALLBACK_METHOD_OPTIONS } from "./constants";

const Callbacks: CollectionConfig = createCollection({
  slug: "forms-callbacks",
  dbName: "forms_callbacks",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "phone", "contact_method", "createdAt"],
    description: "Callback requests submitted through the Request a Callback form.",
  },
  access: {
    update: () => false,
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Contact number",
      type: "text",
      required: true,
    },
    {
      name: "contact_method",
      label: "How they'd like to chat",
      type: "text",
      required: true,
      validate: (value: string | null | undefined) => {
        const known = CALLBACK_METHOD_OPTIONS.map((option) => option.value as string);
        return !value || known.includes(value) || `Unknown contact method: ${value}`;
      },
    },
    {
      name: "preferred_datetime",
      label: "Preferred time to chat",
      type: "date",
      required: false,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "additional_info",
      label: "Additional information",
      type: "textarea",
      required: false,
    },
    {
      name: "consent",
      label: "Consented to data storage",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
  ],
});

export default Callbacks;
