import { responsive } from "@elvora/utils/breakpoints";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import typography from "@elvora/theme/typography";

const SectionHeader: React.FC<SectionHeaderProps> = ({ overline, title, subtitle, textAlign = "center", ...props }) => {
  if (!title && !subtitle && !overline) return null;

  return (
    <Stack
      alignItems={textAlign === "center" ? "center" : "flex-start"}
      {...props}
      sx={{
        ...sx,
        ...(props.sx as object),
      }}
      className="section-header"
      spacing={1.25}
    >
      <div>
        {!!overline && (
          <Typography textAlign={textAlign} color="common.red" letterSpacing={3} fontWeight={500} variant="overline" className="overline" component="p">
            {overline}
          </Typography>
        )}
        {!!title && (
          <Typography textAlign={textAlign} variant="h2" fontWeight={600} lineHeight={1.25} className="title" gutterBottom>
            {title}
          </Typography>
        )}
      </div>
      {!!subtitle && (
        <Typography
          color="text.secondary"
          className="subtitle"
          textAlign={textAlign}
          maxWidth={{
            lg: 700,
            xl: 1200,
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
} & Omit<StackProps, "title">;

export default SectionHeader;
