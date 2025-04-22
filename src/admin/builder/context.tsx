import { JobForm } from "@elvora/types";
import { useField } from "@payloadcms/ui";
import get from "lodash/get";
import set from "lodash/set";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Path } from "react-hook-form";
import { addNewFieldRef, removeFieldRef } from "./refs";
import { FieldDefinition } from "./types";

export const FormBuilderContext = createContext<FormBuilderContextType>(undefined as unknown as any);

export const FormBuilderProvider = ({ children }: React.PropsWithChildren) => {
  const fieldConfig = useField<JobForm["form"]>({ path: "form", hasRows: true, disableFormData: false });
  const { value: openFieldIndex, setValue: _setOpenFieldIndex } = useField<number>({ path: "openFieldIndex" });

  const { setValue, value: formValue } = fieldConfig;

  const watch = useCallback(
    (name: Path<JobForm["form"]>, _default: any = null) => {
      return get(formValue, name, _default);
    },
    [formValue]
  );

  const setFormValue = useCallback(
    (name: Path<JobForm["form"]>, value: any) => {
      const newValue = deepCopy(formValue);
      setValue(set(newValue, name, value));
    },
    [formValue, setValue]
  );

  const _addNewFieldRef = useCallback(
    (field: FieldDefinition) => {
      const fields = formValue.fields || [];
      setFormValue("fields", [...fields, field]);
      setOpenField(fields.length);
    },
    [formValue]
  );

  const _removeFieldRef = useCallback(
    (index: number) => {
      const fields = formValue.fields || [];
      const newFields = [...fields.slice(0, index), ...fields.slice(index + 1)];

      let newOpenFieldIndex = openFieldIndex > index ? openFieldIndex - 1 : openFieldIndex;

      if (newOpenFieldIndex < 0) {
        newOpenFieldIndex = 0;
      }

      setFormValue("fields", newFields);

      setOpenField(newOpenFieldIndex);
    },
    [formValue, openFieldIndex]
  );

  const setOpenField = useCallback(
    (index: number) => {
      _setOpenFieldIndex(index, true);
    },
    [_setOpenFieldIndex]
  );

  const errors = useMemo(() => {
    return JSON.parse(fieldConfig.errorMessage || "{}") as Record<Path<JobForm["form"]>, { message: string; type: string }>;
  }, [fieldConfig.errorMessage]);

  const getFieldError = useCallback(
    (name: Path<JobForm["form"]>) => {
      return get(errors, name, null);
    },
    [errors]
  );

  useEffect(() => {
    //@ts-ignore
    addNewFieldRef.current = _addNewFieldRef;
    //@ts-ignore
    removeFieldRef.current = _removeFieldRef;
    return () => {
      //@ts-ignore
      addNewFieldRef.current = null;
      //@ts-ignore
      removeFieldRef.current = null;
    };
  }, [_addNewFieldRef]);

  return (
    <FormBuilderContext.Provider
      value={{
        setFormValue,
        formValue,
        watch,
        addNewFieldRef,
        openFieldIndex,
        removeFieldRef,
        setOpenField,
        getFieldError,
        hasFieldError: (name) => !!getFieldError(name),
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilderContext = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilderContext must be used within a FormBuilderProvider");
  }
  return context;
};

export type FormBuilderContextType = {
  setFormValue: (name: Path<JobForm["form"]>, value: any) => void;
  formValue: JobForm["form"];
  watch: <T extends any>(name: Path<JobForm["form"]>, _default?: T) => T;
  removeFieldRef: React.RefObject<((index: number) => void) | null>;
  addNewFieldRef: React.RefObject<((field: FieldDefinition) => void) | null>;
  openFieldIndex: number;
  setOpenField: (index: number) => void;
  getFieldError: (name: Path<JobForm["form"]>) => {
    message: string;
    type: string;
  } | null;

  hasFieldError: (name: Path<JobForm["form"]>) => boolean;
};

const deepCopy = <T extends object>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
