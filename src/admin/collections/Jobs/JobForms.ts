// @elvora/admin/builder

import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import get from "lodash/get";
import * as yup from "yup";

export const FIELD_TYPES = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Long Text",
    value: "longText",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "URL",
    value: "url",
  },
  {
    label: "Date",
    value: "date",
  },
  {
    label: "Select",
    value: "select",
  },
  {
    label: "Single Choice",
    value: "radio",
  },
  {
    value: "checkbox",
    label: "Multi Choice",
  },
];

export const JobForms = createCollection({
  slug: "job-forms",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "createdAt"],
    listSearchableFields: ["name"],
    preview: (data) => {
      return `/preview/job-forms/${data.id}`;
    },
  },
  fields: [
    {
      name: "name",
      label: "Form Name",
      type: "text",
      required: true,
      admin: {
        placeholder: "Give this form a relevant name e.g. 'Care Assistant Application'",
        description: "This name will be used to identify the form in the admin panel.",
      },
    },

    {
      name: "form",
      label: "Form",
      type: "json",
      required: true,
      defaultValue: {
        fields: [],
      },
      async validate(value) {
        const response = await jobFormInnerSchemaResolver(value as any, value, { shouldUseNativeValidation: false } as any);

        if (response.errors && Object.keys(response.errors).length > 0) {
          return JSON.stringify(response.errors);
        }

        return true;
      },

      typescriptSchema: [
        ({ jsonSchema }) => {
          return {
            ...jsonSchema,
            type: "object",
            properties: {
              fields: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    fieldType: {
                      type: "string",
                      enum: FIELD_TYPES.map((field) => field.value),
                    },
                    label: {
                      type: "string",
                    },
                    properties: {
                      type: "object",
                      properties: {
                        required: {
                          type: "boolean",
                        },
                        helperText: {
                          type: "string",
                        },
                        options: {
                          type: "string",
                        },
                        placeholder: {
                          type: "string",
                        },
                        disablePast: {
                          type: "boolean",
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                  required: ["fieldType", "label"],
                },
              },
            },
            required: ["fields"],
            additionalProperties: false,
          };
        },
      ],

      admin: {
        components: {
          Field: {
            path: "@elvora/admin/builder/index.ts#FormBuilderField",
          },
        },
      },
    },

    {
      type: "group",
      name: "fields",
      label: "Add New Field",
      virtual: true,
      admin: {
        description: "Add a new field to your form. You can customize the properties once the field is added.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "fieldType",
              label: "Field Type",
              type: "select",
              options: FIELD_TYPES,
              virtual: true,
            },
            {
              name: "fieldLabel",
              label: "Field Label",
              type: "text",
              virtual: true,
            },
          ],
        },
        {
          name: "addFieldButton",
          label: "Add Field",
          type: "ui",
          admin: {
            components: {
              Field: "@elvora/admin/builder/add-field.tsx#AddFieldButton",
            },
          },
        },
      ],
    },

    {
      type: "number",
      defaultValue: 0,
      name: "openFieldIndex",
      label: "Open Field Index",
      virtual: true,
      admin: {
        hidden: true,
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
    },
    maxPerDoc: 5,
  },
});

const jobFormInnerSchema = yup.object().shape({
  fields: yup
    .array()
    .of(
      yup.object().shape({
        fieldType: yup
          .string()
          .required()
          .oneOf(FIELD_TYPES.map((field) => field.value, "Select a valid field type")),
        label: yup.string().required("Label is required"),
        properties: yup.object().shape({
          required: yup.boolean().default(false),
          helperText: yup.string().nullable(),
          options: yup
            .string()
            .nullable()
            .when("$fields", ([fields], schema, props) => {
              const { path, index } = props as ResolveOptions<string>;

              if (!path) return schema;

              const fieldConfig = get<NonNullable<FormSchema["fields"]>[number]>(fields ?? [], index);

              if (!fieldConfig) return schema;

              switch (fieldConfig.fieldType) {
                case "select":
                case "radio":
                case "checkbox":
                  return schema.required("Options are required for select, radio, and checkbox fields.").test({
                    skipAbsent: true,
                    test: function (value) {
                      const options = value
                        ?.split(",")
                        .map((option) => option.trim())
                        .filter(Boolean);

                      if (options.length === 0) {
                        return this.createError({
                          message: "Please add one or more options",
                        });
                      }

                      return true;
                    },
                  });
                default:
                  return schema;
              }
            }),
        }),
      })
    )
    .min(1, "At least one field is required"),
});

type FormSchema = yup.InferType<typeof jobFormInnerSchema>;

type ResolveOptions<Value extends any, Parent extends object = {}> = {
  originalValue: Value;
  strict: boolean;
  parent: Parent;
  value: Value;
  key: "options";
  path: "fields[0].properties.options";
  index: number;
};

const jobFormInnerSchemaResolver = yupResolver(jobFormInnerSchema);
