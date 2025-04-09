import { differenceInDays } from "date-fns";
import type { CollectionConfig } from "payload";
import { JobPosting as IJobPosting } from "types/payload";
import { v4 as uuidv4 } from "uuid";

const JobPosting: CollectionConfig = {
  slug: "job-postings",
  admin: {
    useAsTitle: "role",
  },

  fields: [
    {
      name: "role",
      label: "Role",
      type: "text",
      required: true,
      admin: {
        placeholder: "Care assistant...",
      },
    },
    {
      name: "uuid",
      type: "text",
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          async (req) => {
            const data = (req.siblingData || req.data) as IJobPosting;

            if (!data.uuid) {
              data.uuid = uuidv4();
            }
          },
        ],
        beforeDuplicate: [
          async () => {
            return uuidv4();
          },
        ],
      },
    },
    {
      name: "job_location",
      label: "Location",
      type: "relationship",
      relationTo: "job-locations",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "richText",
      required: true,
      admin: {
        description:
          "A description of the job posting. The first 160 characters will be used as a preview. Please ensure the first 160 characters provide a clear and concise summary of the job posting.",
      },
    },
    {
      name: "short_description",
      type: "text",
      required: false,
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          async (req) => {
            const data = req.data as IJobPosting;

            // await import { getSubstringFromLexicalRichText } from "utils/functions";
            const getSubstringFromLexicalRichText = await import("utils/functions").then((mod) => mod.getSubstringFromLexicalRichText);

            if (data.description) {
              data.short_description = getSubstringFromLexicalRichText(data.description as any);
            }
          },
        ],
      },
    },
    {
      name: "job_types",
      label: "Job Types",
      type: "select",
      required: true,
      hasMany: true,
      options: [
        {
          label: "Full Time",
          value: "full-time",
        },
        {
          label: "Part Time",
          value: "part-time",
        },
        {
          label: "Contract",
          value: "contract",
        },
        {
          label: "Temporary",
          value: "temporary",
        },
        {
          label: "Internship",
          value: "internship",
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      label: "Pay Range(£) Per Hour",
      type: "collapsible",

      admin: {
        position: "sidebar",
        initCollapsed: true,
        description: "If the rate is fixed, only fill in the minimum pay field.",
      },
      fields: [
        {
          name: "min_pay",
          label: "Minimum Pay",
          type: "number",
          admin: {
            placeholder: "£",
          },
          min: 1,
        },
        {
          name: "max_pay",
          label: "Maximum Pay",
          type: "number",
          admin: {
            placeholder: "£",
          },
          min: 1,
          validate(_: any, req: any) {
            const data = req.data as IJobPosting;

            if (data.max_pay && !data.min_pay) {
              return "Please provide a minimum pay if you are providing a maximum pay.";
            }

            if (data.max_pay && data.min_pay && data.max_pay < data.min_pay) {
              return "The maximum pay must be greater than the minimum pay.";
            }

            return true;
          },
        },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "draft",
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
      ],
      admin: {
        position: "sidebar",
        isClearable: false,
        isSortable: true,
        description: "Toggle between draft and published to control the visibility of the job posting.",
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: false,
      admin: {
        position: "sidebar",
        condition: (_, siblingData) => siblingData.status === "published",
        placeholder: "Start date of the job",
      },

      validate: async (value, req) => {
        const data = req.data as IJobPosting;

        if (!value) return true;

        if (data.start_date) {
          const date = new Date(data.start_date);

          if (date === value) return true;
        }

        const days = differenceInDays(value, new Date());

        if (days < 1) {
          return "Start date must be one or more days after now.";
        }

        return true;
      },
    },
    {
      name: "job_expiration",
      label: "Job Expiration",
      type: "date",
      required: false,

      admin: {
        position: "sidebar",
        condition: (_, siblingData) => siblingData.status === "published",
      },

      // must one or more days after now if being created
      validate: async (value, req) => {
        const data = req.data as IJobPosting;

        if (!value) return true;

        if (data.job_expiration) {
          const date = new Date(data.job_expiration);

          if (date === value) return true;
        }

        const days = differenceInDays(value, new Date());

        if (days < 1) {
          return "Job expiration must be one or more days after now.";
        }

        return true;
      },
    },
    {
      type: "relationship",
      name: "job_questions",
      label: "Job Questions",
      relationTo: "job-forms",
      hasMany: false,
      admin: {
        position: "sidebar",
        description: "Select the job form that will be used for this job posting.",
        allowCreate: true,
      },
    },
  ],
};

export default JobPosting;
