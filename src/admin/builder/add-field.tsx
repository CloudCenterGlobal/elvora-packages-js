"use client";

import { Button, PlusIcon, toast, useField } from "@payloadcms/ui";
import { FormBuilderProvider } from "./context";
import { addNewFieldRef } from "./refs";

export const AddFieldButton = ({ field: fieldConfig }: AddFieldButtonProps) => {
  const fieldType = useField({ path: "fields.fieldType" });
  const fieldLabel = useField({ path: "fields.fieldLabel" });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!fieldLabel.value || !fieldType.value) {
      return toast.error("Field Label and Field Type are required", {
        position: "bottom-right",
        dismissible: true,
        duration: 3000,
      });
    }

    addNewFieldRef.current?.({
      label: fieldLabel.value as string,
      fieldType: fieldType.value as any,
    });

    fieldLabel.setValue("", true);
  };

  return (
    <FormBuilderProvider>
      <Button icon={<PlusIcon />} type="button" onClick={handleSubmit as any}>
        {fieldConfig.label}
      </Button>
    </FormBuilderProvider>
  );
};

export type AddFieldButtonProps = {
  field: {
    name: string;
    label: string;
    type: "ui";
  };
  path: string;
  permissions: boolean;
  readOnly: boolean;
  schemaPath: string;
};
