"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { SnackbarProvider } from "notistack";
import { notistackRef } from "./ref";

const NotistackProvider = (props: React.PropsWithChildren) => {
  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          "& .notistack-MuiContent": {
            borderRadius: theme.shape.borderRadius,
            maxWidth: 420,
            color: theme.palette.grey[50],
          },
          "& .notistack-MuiContent.notistack-MuiContent-success": {
            backgroundColor: theme.palette.success.main,
            boxShadow: theme.customShadows.success,
          },
          "& .notistack-MuiContent.notistack-MuiContent-error": {
            backgroundColor: theme.palette.error.main,
            boxShadow: theme.customShadows.error,
          },
          "& .notistack-MuiContent.notistack-MuiContent-warning": {
            backgroundColor: theme.palette.warning.main,
            boxShadow: theme.customShadows.warning,
          },
          "& .notistack-MuiContent.notistack-MuiContent-info": {
            backgroundColor: theme.palette.info.main,
            boxShadow: theme.customShadows.info,
          },
        })}
      />
      {/* @ts-ignore */}
      <SnackbarProvider
        ref={notistackRef}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={4000}
      >
        {/* @ts-ignore */}
        {props.children}
      </SnackbarProvider>
    </>
  );
};

export { NotistackProvider };
