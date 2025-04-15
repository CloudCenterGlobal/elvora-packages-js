import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { v4 as uuidv4 } from "uuid";

const JobApplications = createCollection({
  slug: "job-applications",
  admin: {
    useAsTitle: "first_name",
    defaultColumns: ["first_name", "last_name", "email", "job", "createdAt"],
    description: "Job applications submitted by users.",
  },
  access: {
    update: () => false,
  },
  fields: [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      label: "Last Name",
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
      name: "mobile",
      label: "Mobile",
      type: "text",
      required: false,
    },
    {
      name: "cv",
      type: "text",
      label: "CV",
      required: true,
    },
    {
      name: "job",
      type: "relationship",
      relationTo: "job-postings",
      required: true,
      hasMany: false,
    },
    {
      name: "assessment",
      label: "Assessment",
      type: "json",
      required: false,
      admin: {
        components: {
          Field: "@elvora/admin/builder/answers-renderer#AnswersRendererField",
        },
      },
      defaultValue: {
        answers: {},
        fields: [],
      },

      typescriptSchema: [
        () => ({
          type: "object",
          properties: {
            answers: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: {
                    type: "string",
                  },
                  fieldType: {
                    type: "string",
                  },
                  properties: {
                    type: "object",
                  },
                },
                additionalProperties: false,
              },
            },
          },
          required: ["answers", "fields"],
          additionalProperties: false,
        }),
      ],
    },

    {
      type: "text",
      name: "uuid",
      label: "UUID",
      required: false,
      admin: { position: "sidebar", readOnly: true, hidden: true },
      unique: true,

      defaultValue: () => uuidv4(),
      // @ts-ignore
      validate: (value) => {
        if (!value) {
          return "UUID is required";
        }
        return true;
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data?.uuid) {
              return uuidv4();
            }
            return data.uuid;
          },
        ],
      },
    },
  ],
});

export default JobApplications;
