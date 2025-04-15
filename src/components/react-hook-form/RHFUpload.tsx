"use client";

import { FileUpload, UploadSingleFile, UploadSingleFileProps } from "@elvora/components/upload";
import { useCallback } from "react";
import { Controller, Path, useFormContext } from "react-hook-form";

function isFileUpload(file: FileUpload | string): file is FileUpload {
  return !!file && typeof file === "object";
}

const RHFUploadSingleFile = <T extends object = {}>({ name, ...other }: RHFUploadSingleFileProps<T>) => {
  const { control } = useFormContext();

  const getHelperText = useCallback(
    (value: File) => {
      if (isFileUpload(value)) {
        return <small>{value.name}</small>;
      }

      return other.helperText;
    },
    [other.helperText]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <UploadSingleFile
            file={field.value}
            onDropAccepted={(files) => {
              if (!files.length) return;
              field.onChange(files[0]);
            }}
            {...other}
            helperText={checkError ? error.message : getHelperText(field.value)}
            error={other.error || checkError}
          />
        );
      }}
    />
  );
};

export type RHFUploadSingleFileProps<T extends object = {}> = {
  name: Path<T>;
  required?: boolean;
} & UploadSingleFileProps;

export { RHFUploadSingleFile };
