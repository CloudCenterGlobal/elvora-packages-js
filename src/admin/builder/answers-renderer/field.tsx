"use client";

import { JobApplication } from "@elvora/types/payload";
import Box from "@mui/material/Box";
import { FieldLabel, JSONField, useField } from "@payloadcms/ui";
import { RenderJobForm } from "../render";

const AnswersRendererField: React.FC<AnswersRendererFieldProps> = ({ field, path }) => {
  const { value } = useField<NonNullable<JobApplication["assessment"]>>({ path });

  return (
    <div>
      <FieldLabel label={field.label} required={field.required} path={path} />
      <Box
        sx={{
          border: "1px solid var(--theme-elevation-200)",
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <RenderJobForm
          formData={
            {
              fields: value?.fields ?? [],
            } as any
          }
          values={(value?.answers ?? {}) as any}
          disabled
        />
      </Box>
    </div>
  );
};

export type AnswersRendererFieldProps = React.ComponentProps<typeof JSONField>;

export { AnswersRendererField };
