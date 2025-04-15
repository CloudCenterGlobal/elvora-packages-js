import { JobForm } from "@elvora/types/payload";

export type FieldDefinitionType = NonNullable<NonNullable<JobForm["fields"]>["fieldType"]>;

export type FieldDefinition = {
  fieldType: FieldDefinitionType;
  label: string;
  properties?: FieldDefinitionProperties;
};

export type FieldDefinitionProperties = {
  placeholder: string;
  required?: boolean;
  options?: FieldDefinitionOption[];
};

export type FieldDefinitionOption = {
  label: string;
  value: string;
};
