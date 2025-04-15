// @mui
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
// utils
import { DropzoneState } from "react-dropzone";
import { fData } from "@elvora/utils/formatNumber";

// ----------------------------------------------------------------------

const RejectionFiles: React.FC<RejectionFilesProps> = ({ fileRejections }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>

            {errors.map((error) => (
              <Typography key={error.code} variant="caption" component="p">
                - {error.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
};

export type RejectionFilesProps = {
  fileRejections: DropzoneState["fileRejections"];
};

export { RejectionFiles };
