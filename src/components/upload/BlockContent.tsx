// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UploadIllustration from "@elvora/components/illustrations/upload";
// assets

// ----------------------------------------------------------------------
const BlockContent: React.FC<BlockContentProps> = () => {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <UploadIllustration sx={{ width: 180 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="subtitle1">
          Drop or Select file
        </Typography>

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Drop files here or click&nbsp;
          <Typography variant="caption" component="span" sx={{ color: "primary.main", textDecoration: "underline" }}>
            browse
          </Typography>
          &nbsp;thorough your device
        </Typography>
      </Box>
    </Stack>
  );
};

export type BlockContentProps = {};

export { BlockContent };
