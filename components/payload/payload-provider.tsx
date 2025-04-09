"use client";

import { GlobalStyles } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme as _theme } from "theme/ThemeProvider";

const PayloadProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={_theme}>
        {children}
        <GlobalStyles styles={styles} />
      </ThemeProvider>
    </AppRouterCacheProvider>
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
