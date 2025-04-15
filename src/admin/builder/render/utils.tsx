import { JobForm } from "@elvora/types/payload";
// import { cache } from "react";
import { EMAIL_REGEX } from "@elvora/constants/email";
import merge from "lodash/merge";
import set from "lodash/set";
import * as yup from "yup";
import { RHFCheckboxProps, RHFMultiCheckboxProps, RHFSelectFieldProps, RHFTextFieldProps } from "@elvora/components/react-hook-form";

const getSchema = (
  form: JobForm["form"],
  values?: {
    [key: string | symbol | number]: any;
  }
) => {
  const _defaultValues: {
    [key: string | symbol | number]: any;
  } = {};

  const fieldProps: Record<
    string,
    | RHFTextFieldProps
    | RHFSelectFieldProps
    | RHFCheckboxProps
    | (RHFCheckboxProps & {
        name: string;
      })
  > = {};

  const schema = form.fields.reduce(
    (acc, field, index) => {
      const { fieldType, properties } = field;
      const { required, options } = properties || ({} as NonNullable<(typeof field)["properties"]>);

      const fieldName = getFieldName(index);

      switch (fieldType) {
        case "text":
        case "longText":
          acc[fieldName] = yup.string().nullable().trim();
          set(_defaultValues, fieldName, "");

          fieldProps[fieldName] = {
            multiline: fieldType === "longText",
            rows: fieldType === "longText" ? 4 : 1,
          } as RHFTextFieldProps;

          break;
        case "email":
          acc[fieldName] = yup
            .string()
            .email("Invalid email")
            .matches(EMAIL_REGEX, "Invalid email")
            .transform((value) => {
              if (typeof value === "string") {
                return value.trim();
              }
              return value;
            })
            .nullable()
            .trim();
          set(_defaultValues, fieldName, "");

          fieldProps[fieldName] = {
            type: "email",
            autoComplete: "email",
            autoCorrect: "off",
            autoCapitalize: "none",
            spellCheck: "false",
            inputMode: "email",
          } as RHFTextFieldProps;
          break;
        case "number":
          acc[fieldName] = yup.number().nullable();
          set(_defaultValues, fieldName, null);

          fieldProps[fieldName] = {
            type: "number",
            slotProps: {
              htmlInput: {
                min: 0,
                step: 1,
              },
            },
          } as RHFTextFieldProps;
          break;
        case "select":
        case "radio":
          {
            const _options = csvToArray(options);

            acc[fieldName] = yup
              .string()
              .nullable()
              .oneOf([...(!required ? [null, undefined] : []), ..._options], "Select a valid option");

            set(_defaultValues, fieldName, "");

            fieldProps[fieldName] = {
              options: _options.map((option) => ({
                label: option,
                value: option,
              })),
            } as RHFSelectFieldProps;

            if (fieldType === "radio") {
              fieldProps[fieldName].type = "radio";
            }
          }
          break;

        case "checkbox":
          {
            const _options = csvToArray(options);

            let schema = yup
              .array()
              .of(yup.string())
              .nullable()
              .transform((value) => {
                if (Array.isArray(value)) {
                  return value.filter(Boolean);
                }
                return [];
              });

            if (required) {
              schema = schema.min(1, "Select at least one option");
            }
            acc[fieldName] = schema;

            set(_defaultValues, fieldName, []);

            fieldProps[fieldName] = {
              options: _options,
            } as RHFMultiCheckboxProps;
          }
          break;

        case "url":
          acc[fieldName] = yup.string().url("Invalid URL").nullable().trim();
          set(_defaultValues, fieldName, "");
          break;
      }

      if (required) {
        acc[fieldName] = acc[fieldName].required("This field is required");
      }

      fieldProps[fieldName] = {
        ...properties,
        ...fieldProps[fieldName],
        // i
      };

      return acc;
    },
    {} as Record<string, yup.AnySchema>
  );

  return {
    schema: yup.object().shape(schema),
    defaultValues: values ? merge(_defaultValues, values) : _defaultValues,
    fieldProps,
  };
};

const csvToArray = (csv: string | undefined) => {
  return (
    csv
      ?.split(",")
      .map((option) => option.trim())
      .filter(Boolean) || []
  );
};

const getFieldName = (index: number) => {
  return `${index}`;
};
export type SchemaType = yup.InferType<ReturnType<typeof getSchema>["schema"]> & {
  [key: string]: any;
};

export { csvToArray, getFieldName, getSchema };
