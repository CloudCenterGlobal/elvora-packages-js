"use client";

import Stack from "@mui/material/Stack";
import { ViewDescription } from "@payloadcms/ui";
import type { JSONFieldClientProps } from "payload";
import { memo } from "react";
import { FormBuilderProvider } from "./context";
import { FieldsListForm } from "./fields-list";
import type { FormBuilderFieldProps } from "./types";

export const FormBuilderField: React.FC<FormBuilderFieldProps> = memo(
  function FormBuilderField({ path, field }) {
    return (
      <FormBuilderProvider>
        <Stack spacing={2} sx={{ mb: 2 }}>
          {!!field.admin?.description && <ViewDescription description={field.admin?.description} />}
        </Stack>
        <Stack spacing={3}>
          <FieldsListForm />
        </Stack>
      </FormBuilderProvider>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.field === nextProps.field && prevProps.path === nextProps.path;
  }
);

declare module "./types" {
  export type FormBuilderFieldProps = JSONFieldClientProps;
}
