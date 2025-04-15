import { alpha } from "@mui/material/styles";
import createPalette from "@mui/material/styles/createPalette";

const PRIMARY = {
  main: "#FF386E",
  light: "#FF7A7F",
} as const;

const SECONDARY = {
  dark: "#200E32",
  main: "#330066",
} as const;

const WARNING = {
  main: "#EB6F0A",
} as const;

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
} as const;

export const palette = {
  primary: PRIMARY,
  secondary: SECONDARY,
  warning: WARNING,
  grey: GREY,
  error: {
    main: "#FD5056",
  },

  common: {
    red: "#FD5056",
    lightBlue: "#4949B0",
    lightGray: "#F0F0F0",
  },

  background: {
    paper: "#FCFCFC",
    default: "#ffffff",
    grey: "#E8E8E8",
    neutral: "#F3F3F3",
  },
  // divider: "#8C849F",
  text: {
    primary: "#1A093F",
    secondary: "#8C849F",
    alt: "#330066",
    light: "#DADFEC",
  },
};

declare module "@mui/material/styles" {
  interface PaletteColor {
    darker: string;
  }

  interface CommonColors {
    red: string;
    lightBlue: string;
    lightGray: string;
  }

  interface TypeText {
    alt: string;
    light: string;
  }

  interface BackgroundColor {
    grey: string;
    neutral: string;
  }

  interface TypeBackground {
    paper: string;
    default: string;
    neutral: string;
    grey: string;
  }
}

declare module "@mui/material/styles/createPalette" {
  type GreyType = typeof GREY;
  interface Color extends GreyType {}

  interface PaletteOptions {}
}

export { GREY, PRIMARY, SECONDARY, WARNING };
export default createPalette(palette);
