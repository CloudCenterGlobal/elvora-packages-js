"use client";

import { DropzoneOptions, useDropzone } from "react-dropzone";
// @mui
import Box from "@mui/material/Box";
//
import { DropZone } from "./DropZone";
import { RejectionFiles } from "./RejectionFiles";

const UploadSingleFile: React.FC<UploadSingleFileProps> = ({ error = false, file, helperText, sx, ...other }) => {
  const methods = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZone {...methods} error={error} helperText={helperText} label={other.label} />
      {methods.fileRejections.length > 0 && <RejectionFiles fileRejections={methods.fileRejections} />}
    </Box>
  );
};

export type FileUpload = File & {
  preview?: string;
};

export type UploadSingleFileProps = {
  error?: boolean;
  file?: string | FileUpload;
  helperText?: React.ReactNode;
  sx?: SxProps;
  label?: React.ReactNode;
} & Partial<DropzoneOptions>;

export { UploadSingleFile };
