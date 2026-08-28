import { responsive } from "@elvora/utils/breakpoints";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import typography from "@elvora/theme/typography";

const SectionHeader: React.FC<SectionHeaderProps> = ({ overline, title, subtitle, textAlign = "center", ...props }) => {
  if (!title && !subtitle && !overline) return null;

  return (
    <Stack
      {...props}
      sx={{
        ...sx,
        alignItems: textAlign === "center" ? "center" : "flex-start",
        ...(props.sx as object),
      }}
      className="section-header"
      spacing={1.25}
    >
      <div>
        {!!overline && (
          <Typography
            color="common.red"
            variant="overline"
            className="overline"
            component="p"
            sx={{ textAlign, letterSpacing: 3, fontWeight: 500 }}
          >
            {overline}
          </Typography>
        )}
        {!!title && (
          <Typography variant="h2" className="title" gutterBottom sx={{ textAlign, fontWeight: 600, lineHeight: 1.25 }}>
            {title}
          </Typography>
        )}
      </div>
      {!!subtitle && (
        <Typography
          color="text.secondary"
          className="subtitle"
          sx={{
            textAlign,
            maxWidth: {
              lg: 700,
              xl: 1200,
            },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

const sx = {
  ".overline": {
    textTransform: "uppercase",
  },
  ".title": {
    [responsive("down", "sm")]: typography.h3,
  },
  ".subtitle": {
    [responsive("down", "sm")]: typography.body2,
  },
};

export type SectionHeaderProps = {
  overline?: React.ReactNode;
  title?: React.ReactNode | React.ReactElement;
  subtitle?: React.ReactNode;
  textAlign?: "center" | "left";
} & Omit<StackProps, "title">;

export default SectionHeader;
