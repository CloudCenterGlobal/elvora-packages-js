"use client";

import { DndContext, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Collapsible } from "@payloadcms/ui";
import { memo, useMemo } from "react";
import { useFormBuilderContext } from "./context";
import { FormBuilderFieldProperties } from "./field-properties";
import { removeFieldRef } from "./refs";
import { FieldDefinition } from "./types";

const getFieldID = (field: FieldDefinition, index: number) => field.id || index;

const FieldsListForm = memo(function FieldsListForm() {
  const { watch, setFormValue, hasFieldError, getFieldError } = useFormBuilderContext();

  const fields = watch<FieldDefinition[]>("fields", []);
  const { setNodeRef } = useDroppable({ id: "fields-dropzone" });

  const fieldIds = useMemo(() => fields.map(getFieldID), [fields]);

  const removeField = (index: number) => {
    removeFieldRef.current?.(index);
  };

  const fieldErrors = getFieldError("fields");

  return (
    <Stack ref={setNodeRef} spacing={3} sx={sx}>
      {fieldErrors?.message && (
        <Typography variant="body2" color="var(--theme-error-500) !important">
          {fieldErrors?.message}
        </Typography>
      )}

      <DndContext
        onDragEnd={({ active, over }) => {
          if (!active || !over || active.id === over.id) return;

          //@ts-expect-error the type is not set
          const currentAtiveIndex = active.data.current.sortable.index;
          //@ts-expect-error the type is not set
          const overIndex = over.data.current.sortable.index;

          setFormValue("fields", arrayMove(fields, currentAtiveIndex, overIndex));
        }}
      >
        <SortableContext items={fieldIds} id="fields-sortable">
          {fields.map((field, index) => {
            const key = getFieldID(field, index);

            return <SortableItem key={key} field={field} hasFieldError={hasFieldError as any} index={index} removeField={removeField} />;
          })}
        </SortableContext>
      </DndContext>
    </Stack>
  );
});

function SortableItem({ hasFieldError, index, field, removeField }: SortableItemProps) {
  const hasError = hasFieldError(`fields.${index}`);
  const id = getFieldID(field, index);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div key={id} style={style} ref={setNodeRef}>
      <Collapsible
        initCollapsed={false}
        collapsibleStyle="default"
        className={hasError ? "error" : ""}
        dragHandleProps={{
          attributes,
          listeners: listeners!,
          id,
          disabled: false,
        }}
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
            <Typography variant="h6" component="div" display="inline-block">
              {field.label}
            </Typography>
          </Stack>
        }
      >
        <FormBuilderFieldProperties index={index} />
      </Collapsible>
    </div>
  );
}

export type SortableItemProps = {
  hasFieldError: (name: string) => boolean;
  index: number;
  field: FieldDefinition;
  removeField: (index: number) => void;
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
