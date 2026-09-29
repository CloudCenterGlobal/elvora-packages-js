import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { INVESTMENT_AREA_OPTIONS } from "./constants";

const PropertyPartners: CollectionConfig = createCollection({
  slug: "forms-property-partners",
  dbName: "forms_property_partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "phone", "property_location", "createdAt"],
    description: "Enquiries submitted through the Supported Living Partners landing page.",
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
      name: "property_location",
      label: "Property location",
      type: "text",
      required: false,
    },
    {
      name: "investment_areas",
      label: "Investment areas",
      type: "text",
      hasMany: true,
      required: false,
      validate: (value: string[] | null | undefined) => {
        const known = INVESTMENT_AREA_OPTIONS.map((option) => option.value as string);
        const invalid = (value ?? []).filter((entry) => !known.includes(entry));
        return invalid.length === 0 || `Unknown investment area(s): ${invalid.join(", ")}`;
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

export default PropertyPartners;
