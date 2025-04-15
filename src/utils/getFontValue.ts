// @mui
import { Breakpoint, useTheme } from "@mui/material/styles";
// hooks
import useResponsive from "@elvora/hooks/useResponsive";

// ----------------------------------------------------------------------

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2";

export default function GetFontValue(variant: Variant) {
  const theme = useTheme();
  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

  const hasResponsive = variant === "h1" || variant === "h2" || variant === "h3" || variant === "h4" || variant === "h5" || variant === "h6";

  const getFont = (hasResponsive && theme.typography[variant][key] ? theme.typography[variant][key] : theme.typography[variant]) as Record<string, string>;

  const fontSize = remToPx(getFont.fontSize);
  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;
  const { fontWeight } = theme.typography[variant];
  const { letterSpacing } = theme.typography[variant];

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}

// ----------------------------------------------------------------------

const FACTOR = 15;
export function remToPx(value: string) {
  return Math.round(parseFloat(value) * FACTOR);
}

export function pxToRem(value: number) {
  return `${value / FACTOR}rem`;
}

export function numberToPx(value: number) {
  if (typeof value !== "number") {
    return value;
  }

  return `${value}px`;
}

export function responsiveFontSizes({
  sm,
  md,
  lg,
}: {
  [key in Breakpoint]?: number;
}) {
  return {
    ...(sm && {
      "@media (min-width:600px)": {
        fontSize: pxToRem(sm),
      },
    }),
    ...(md && {
      "@media (min-width:900px)": {
        fontSize: pxToRem(md),
      },
    }),
    ...(!!lg && {
      "@media (min-width:1200px)": {
        fontSize: pxToRem(lg),
      },
    }),
  };
}

// ----------------------------------------------------------------------

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce(
      (output, key) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useResponsive("up", key);
        return !output && matches ? key : output;
      },
      null as unknown as Breakpoint
    ) || "xs"
  );
}
