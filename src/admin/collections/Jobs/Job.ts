import { createCollection, userHasPermission } from "@elvora/admin/collections/Permissions/helpers";
import { currentUserField } from "@elvora/admin/fields/user";
import { JobPosting as IJobPosting } from "@elvora/types/payload";
import { differenceInDays } from "date-fns";
import set from "lodash/set";
import type { Option } from "payload";
import { v4 as uuidv4 } from "uuid";
import { JOB_STATUS_OPTIONS, JOB_TITLES, RECRUITMENT_TYPES } from "./constants";
const JobPosting = createCollection({
  slug: "job-postings",
  admin: {
    useAsTitle: "role",
    defaultColumns: ["role", "status", "createdBy", "createdAt", "updatedAt"],
    description: "Job postings are used to display job openings on the website.",
  },

  fields: [
    {
      name: "role",
      label: "Job Title",
      type: "select",
      options: JOB_TITLES as unknown as Option[],
      required: true,
      admin: {
        description: "Select the job title for the posting.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          name: "metadata",
          fields: [
            {
              name: "recruitment_type",
              label: "Recruitment Type",
              type: "select",
              options: RECRUITMENT_TYPES as unknown as Option[],
              required: true,
              defaultValue: "Internal",
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
            },

            {
              name: "job_location",
              label: "Location",
              type: "relationship",
              relationTo: "job-locations",
              required: true,
            },
            {
              name: "weekly_hours",
              label: "Weekly Hours",
              type: "number",
              admin: {
                description: "The number of hours the employee is expected to work each week.",
              },
              min: 1,
            },
            {
              label: "Hourly Rate(£) Per Hour",
              type: "collapsible",

              admin: {
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

                    if (data.metadata.max_pay && !data.metadata.min_pay) {
                      return "Please provide a minimum pay if you are providing a maximum pay.";
                    }

                    if (data.metadata.max_pay && data.metadata.min_pay && data.metadata.max_pay < data.metadata.min_pay) {
                      return "The maximum pay must be greater than the minimum pay.";
                    }

                    return true;
                  },
                },
              ],
            },

            {
              name: "reason_for_hiring",
              label: "Reason for Hiring",
              type: "textarea",
              admin: {
                description: "A brief reason for hiring for this job posting.",
              },
            },
          ],
        },
        {
          name: "details",
          fields: [
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

                    const getSubstringFromLexicalRichText = await import("@elvora/utils/functions").then((mod) => mod.getSubstringFromLexicalRichText);

                    if (data.details.description) {
                      data.details.short_description = getSubstringFromLexicalRichText(data.details.description as any);
                    }
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    {
      name: "uuid",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "A unique identifier for the job posting. Automatically generated.",
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          async (req) => {
            const data = (req.siblingData || req.data) as IJobPosting;

            if (!data?.uuid) {
              set(data, "uuid", uuidv4());
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
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "draft",
      options: JOB_STATUS_OPTIONS as unknown as Option[],
      required: true,
      admin: {
        position: "sidebar",
        isClearable: false,
        isSortable: true,
        description: "Toggle between draft and published to control the visibility of the job posting.",
      },
      access: {
        create({ req }) {
          return userHasPermission(req, ["job-postings.publish"]);
        },
        update({ req }) {
          return userHasPermission(req, ["job-postings.publish"]);
        },
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: false,
      admin: {
        position: "sidebar",
        description: "The date the employee is expected to start work.",
        condition: (_, siblingData) => siblingData?.status === "published",
      },

      validate: async (value, req) => {
        const data = req.data as IJobPosting;

        if (!value) return true;

        if (data?.start_date) {
          const date = new Date(data?.start_date);

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
        condition: (_, siblingData) => siblingData?.status === "published",
      },

      // must one or more days after now if being created
      validate: async (value, req) => {
        const data = req.data as IJobPosting;

        if (!value) return true;

        if (data?.job_expiration) {
          const date = new Date(data?.job_expiration);

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
        description: "Select the job form that will be used for this job posting.",
        allowCreate: true,
        position: "sidebar",
      },
    },

    currentUserField({
      admin: {
        position: "sidebar",
        description: "The user who created the job posting.",
      },
      access: {
        update: () => false,
      },
    }),
    currentUserField({
      name: "published_by",
      label: "Published By",
      admin: {
        position: "sidebar",
        description: "The user who published the job posting.",
      },

      hooks: {
        beforeChange: [
          async ({ req }) => {
            const data = req.data as IJobPosting;

            if (data.status === "published") {
              return req.user?.id;
            }

            return null;
          },
        ],
      },
    }),
  ],
});

export default JobPosting;
