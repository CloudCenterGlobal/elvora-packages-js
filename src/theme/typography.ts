import { pxToRem, responsiveFontSizes } from "@elvora/utils/getFontValue";
import palette from "./palette";
import { FONTS } from "./fonts";

const typography = {
  fontFamily: FONTS.poppins.fontFamily,
  fontWeightLight: FONTS.poppins.fontWeights[300],
  fontWeightRegular: FONTS.poppins.fontWeights[400],
  fontWeightMedium: FONTS.poppins.fontWeights[500],
  fontWeightBold: FONTS.poppins.fontWeights[700],

  allVariants: {
    color: palette.text.primary,
  },

  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    letterSpacing: 2,
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 36, md: 44, lg: 44 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.25,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 30 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 28 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 1.25,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 17, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(13),
    ...responsiveFontSizes({ sm: 14, md: 14 }),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(13),
    ...responsiveFontSizes({ sm: 14, md: 14 }),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  caption2: {
    lineHeight: 1.5,
    fontSize: pxToRem(10),
  },
  overline: {
    fontWeight: 500,
    lineHeight: 1.5,
    // fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 14, md: 15, lg: 16 }),
    textTransform: "uppercase",
    letterSpacing: 1.75,
  },
  button: {
    lineHeight: 24 / 13,
    fontSize: pxToRem(13),
    ...responsiveFontSizes({ sm: 14, md: 14 }),
  },
};

declare module "@mui/material/Typography" {
  interface TypographyOptions {
    caption2: React.CSSProperties;
  }

  interface Typography {
    caption2: React.CSSProperties;
  }

  interface TypographyPropsVariantOverrides {
    caption2: true;
  }
}

export default typography;
