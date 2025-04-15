import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { useFormBuilderContext } from "./context";
import { FieldDefinition } from "./types";
import { fieldComponents, FormBuilderFieldPropertiesProps, getFieldPropertiesMapping } from "./utils";

const FormBuilderFieldProperties: React.FC<Omit<FormBuilderFieldPropertiesProps, "field">> = ({ index }) => {
  const { watch } = useFormBuilderContext();

  const field = watch(`fields.${index}`) as FieldDefinition;

  const components = useMemo(() => {
    if (!field?.fieldType) {
      return [];
    }
    return getFieldPropertiesMapping(field.fieldType);
  }, [field?.fieldType]);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack flex={1} spacing={1} className="field-properties">
        {components.map((component) => {
          const Component = fieldComponents[component];

          return <Component key={component} index={index} field={field} />;
        })}
      </Stack>
    </Stack>
  );
};

// types

export { FormBuilderFieldProperties };
