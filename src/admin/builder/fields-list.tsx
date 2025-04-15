"use client";

import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Collapsible, DragHandleIcon } from "@payloadcms/ui";
import { useFormBuilderContext } from "./context";
import { FormBuilderFieldProperties } from "./field-properties";
import { removeFieldRef } from "./refs";
import { FieldDefinition } from "./types";

const FieldsListForm = () => {
  const { watch, openFieldIndex, setOpenField, hasFieldError, getFieldError } = useFormBuilderContext();

  const fields = watch("fields", []) as FieldDefinition[];

  const removeField = (index: number) => {
    removeFieldRef.current?.(index);
  };

  const fieldErrors = getFieldError("fields");

  return (
    <Stack spacing={2} sx={sx}>
      {fieldErrors?.message && (
        <Typography variant="body2" color="var(--theme-error-500) !important">
          {fieldErrors?.message}
        </Typography>
      )}

      {fields.map((field, index) => {
        const hasError = hasFieldError(`fields.${index}`);

        return (
          <Collapsible
            initCollapsed={false}
            isCollapsed={openFieldIndex !== index}
            onToggle={() => setOpenField(index)}
            key={index}
            collapsibleStyle="default"
            className={hasError ? "error" : ""}
            actions={
              <IconButton
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(index);
                }}
                type="button"
              >
                <Delete />
              </IconButton>
            }
            header={
              <Stack direction="row" alignItems="center" spacing={1}>
                <DragHandleIcon />
                <Typography variant="h6" component="div" display="inline-block">
                  {field.label}
                </Typography>
              </Stack>
            }
          >
            <FormBuilderFieldProperties index={index} />
          </Collapsible>
        );
      })}
    </Stack>
  );
};

const sx: SxProps = {
  "& .label": {
    minWidth: 100,
  },
  "& .field-properties .MuiTextField-root": {
    "& label": {
      display: "none",
    },

    "*": {
      borderColor: "inherit !important",
    },
  },

  "& .MuiTypography-root": {
    color: "inherit",
  },

  "& .error": {
    borderColor: "var(--theme-error-500)",
    "& .collapsible__toggle-wrap": {
      backgroundColor: "var(--theme-error-50)",
    },
  },
};

export { FieldsListForm };
