"use client";
// @mui
import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ----------------------------------------------------------------------

type Query = "up" | "down" | "between" | "only";

export default function useResponsive<T extends Query>(query: T, key: Breakpoint, start?: Breakpoint, end?: Breakpoint) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key));

  const mediaDown = useMediaQuery(theme.breakpoints.down(key));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start || key, end || key));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(key));

  if (query === "up") {
    return mediaUp;
  }

  if (query === "down") {
    return mediaDown;
  }

  if (query === "between") {
    return mediaBetween;
  }

  if (query === "only") {
    return mediaOnly;
  }
}
