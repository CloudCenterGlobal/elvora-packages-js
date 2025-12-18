"use client";

import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DropzoneState } from "react-dropzone";
import { BlockContent } from "./BlockContent";

const DropZone: React.FC<DropZoneProps> = ({
  isDragActive,
  isDragReject,
  getRootProps,
  getInputProps,
  label,
  error,
  helperText,
}) => {
  return (
    <Box
      sx={sx}
      className={`drop-zone-wrapper ${isDragActive ? "active" : ""} ${isDragReject || error ? "reject" : ""}`}
    >
      {!!label && (
        <Typography variant="subtitle2" fontWeight={500} className="label">
          {label}
        </Typography>
      )}
      <Box {...getRootProps()} className="drop-zone">
        <input {...getInputProps()} />
        <BlockContent />
      </Box>

      {!!helperText && (
        <FormHelperText error={error} sx={{ textAlign: "center" }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

const sx: SxProps = {
  display: "flex",
  flexDirection: "column",

  outline: "none",
  overflow: "hidden",
  position: "relative",
  paddingTop: 2,
  paddingBottom: 4,
  paddingX: 2,
  borderRadius: 1,
  backgroundColor: "background.neutral",
  borderWidth: 1,
  borderStyle: "dashed",
  borderColor: "grey.50032",

  "&:hover": {
    opacity: 0.72,
    cursor: "pointer",
  },
  "&.reject": {
    borderColor: "error.main",

    "& .label": {
      color: "error.main",
    },
  },

  "& .drop-zone": {
    paddingTop: 3,
  },
};

export type DropZoneProps = {
  children?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
} & DropzoneState;
export { DropZone };
