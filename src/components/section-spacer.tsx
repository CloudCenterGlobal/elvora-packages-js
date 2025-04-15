import Box, { BoxProps } from "@mui/material/Box";

const SECTION_SPACER = {
  xs: 8,
  sm: 9,
  lg: 10,
  xl: 14,
};

const SECTION_SPACER_SMALL = {
  xs: 4,
  sm: 4,
  lg: 5,
  xl: 7,
};

const SECTION_SPACER_SMALLER = {
  xs: 2,
  lg: 3,
};

const SectionSpacer = ({
  small,
  smaller,
  ...props
}: BoxProps & {
  small?: boolean;
  smaller?: boolean;
}) => (
  <Box
    paddingTop={small ? SECTION_SPACER_SMALL : smaller ? SECTION_SPACER_SMALLER : SECTION_SPACER}
    {...props}
    className={`section-spacer ${props.className || ""}`}
  />
);

export { SECTION_SPACER, SECTION_SPACER_SMALL, SECTION_SPACER_SMALLER };
export default SectionSpacer;
