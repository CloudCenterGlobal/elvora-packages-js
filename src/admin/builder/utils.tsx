import { JobFormValues } from "@elvora/types/payload";
import { Path } from "react-hook-form";
import { PayloadOptionsField } from "./inputs/options";
import { PayloadSwitch } from "./inputs/switch";
import { PayloadTextField } from "./inputs/text-field";
import { FieldDefinition, FieldDefinitionType } from "./types";

export type FormBuilderFieldPropertiesProps = {
  index: number;
  field: FieldDefinition;
};

const formFieldName = <T extends Path<JobFormValues>, X extends (string | number)[]>(
  key: T,
  ...params: X
): `${T}${X["length"] extends 0 ? "" : `.${string}`}` => {
  return `${key}${params.length ? `.${params.join(".")}` : ""}` as any;
};

const fieldComponents = {
  helperText: ({ index }: FormBuilderFieldPropertiesProps) => (
    <PayloadTextField name={formFieldName(`fields.${index}.properties.helperText`)} label=" Helper Text" />
  ),
  label: ({ index }: FormBuilderFieldPropertiesProps) => (
    <PayloadTextField name={formFieldName(`fields.${index}.label`)} label="Label" required placeholder="The label of this field" />
  ),
  required: ({ index }: FormBuilderFieldPropertiesProps) => <PayloadSwitch name={formFieldName(`fields.${index}.properties.required`)} label="Required" />,
  placeholder: ({ index }: FormBuilderFieldPropertiesProps) => (
    <PayloadTextField name={formFieldName(`fields.${index}.properties.placeholder`)} label="Placeholder" />
  ),
  options: ({ index }: FormBuilderFieldPropertiesProps) => (
    <PayloadOptionsField name={formFieldName(`fields.${index}.properties.options`)} label="Options" required />
  ),
} as const;

const createFieldPropertiesMapping = <X extends FieldComponentKeys, T extends OptionsConfig<X>>(options: Pick<T, "text"> & Partial<Omit<T, "text">>) => {
  return options;
};

const fieldPropertiesMapping = createFieldPropertiesMapping({
  text: ["label", "helperText", "placeholder", "required"],
  select: ["label", "helperText", "required", "options"],
  checkbox: ["label", "helperText", "required", "options"],
  radio: ["label", "helperText", "required", "options"],
});

export const getFieldPropertiesMapping = <X extends keyof typeof fieldPropertiesMapping>(key: X) => {
  return fieldPropertiesMapping[key] ?? fieldPropertiesMapping.text;
};
// types
type OptionsConfig<X extends FieldComponentKeys> = {
  [key in FieldDefinitionType]: X[];
};

type FieldComponentKeys = keyof typeof fieldComponents;

export { fieldComponents, fieldPropertiesMapping };
