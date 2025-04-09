import type { SxProps, Theme } from "@mui/material/styles";
import { theme } from "theme";

const mergeSxProps = <T extends (SxProps<Theme> | undefined | false)[]>(...sx: T) => {
  return sx.reduce((acc, curr) => {
    const _type = typeof curr;

    if (_type === "boolean" || !curr) return acc;

    // @ts-expect-error - curr is not a boolean
    const sx = _type === "function" ? curr?.(theme as Theme) : curr;
    return {
      ...acc,
      ...sx,
    };
  }, {}) as SxProps<Theme>;
};

export { mergeSxProps };
