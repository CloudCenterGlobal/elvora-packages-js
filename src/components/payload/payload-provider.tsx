"use client";

import { GlobalStyles } from "@mui/material";
import { DateLocalizationProvider } from "../date-localization";

// @ts-ignore
import ThemeProvider from "@theme/provider";

const PayloadProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <DateLocalizationProvider>{children}</DateLocalizationProvider>
      <GlobalStyles styles={styles} />
    </ThemeProvider>
  );
};

const styles = {
  "& .template-default": {
    "& .MuiTypography-root, & .MuiFormLabel-root, & .MuiFormControlLabel-root .MuiButtonBase-root": {
      color: "var(--theme-elevation-900) !important",
    },
    "& .MuiFormHelperText-root": {
      color: "var(--theme-elevation-800) !important",
    },

    "& fieldset": {
      borderColor: "var(--theme-elevation-200) !important",

      "& legend *": {
        color: "var(--theme-elevation-900) !important",
      },
    },

    "& .Mui-disabled": {
      color: "var(--theme-elevation-800) !important",
      WebkitTextFillColor: "var(--theme-elevation-800) !important",
    },
  },
};

export { PayloadProvider };
