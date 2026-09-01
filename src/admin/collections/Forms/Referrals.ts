import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionConfig } from "payload";
import { REFERRAL_SERVICE_OPTIONS } from "./constants";

const Referrals: CollectionConfig = createCollection({
  slug: "forms-referrals",
  dbName: "forms_referrals",
  admin: {
    useAsTitle: "referred_name",
    defaultColumns: ["referred_name", "referrer_name", "organisation", "email", "createdAt"],
    description: "Referrals submitted through the Make a Referral form.",
  },
  access: {
    update: () => false,
  },
  fields: [
    {
      type: "collapsible",
      label: "Referral Details",
      fields: [
        {
          name: "referred_name",
          label: "Who is being referred",
          type: "text",
          required: true,
        },
        {
          name: "referred_age",
          label: "Age",
          type: "number",
          required: true,
        },
        {
          name: "services",
          label: "Services of interest",
          type: "select",
          hasMany: true,
          required: true,
          options: [...REFERRAL_SERVICE_OPTIONS],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Additional Information",
      fields: [
        {
          name: "documents",
          label: "Supporting documents",
          type: "upload",
          relationTo: "forms-referral-documents",
          hasMany: true,
          required: false,
        },
        {
          name: "additional_info",
          label: "Additional information",
          type: "textarea",
          required: false,
        },
      ],
    },
    {
      type: "collapsible",
      label: "Referrer Details",
      fields: [
        {
          name: "referrer_name",
          label: "Referrer name",
          type: "text",
          required: true,
        },
        {
          name: "organisation",
          label: "Referring organisation",
          type: "text",
          required: true,
        },
        {
          name: "role",
          label: "Referrer role",
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
          label: "Phone",
          type: "text",
          required: true,
        },
        {
          name: "consent",
          label: "Consented to data storage",
          type: "checkbox",
          required: true,
          defaultValue: false,
        },
      ],
    },
  ],
});

export default Referrals;
