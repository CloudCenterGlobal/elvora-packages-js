import type { SxProps, Theme } from "@mui/material/styles";

const mergeSxProps = <T extends (SxProps<Theme>|undefined|false)[]>(...sx: T) => {
  // @ts-ignore
  return sx.reduce((acc, curr) => {
    const _type = typeof curr;

    if (_type === "boolean" || !curr) return acc;

    return {
      ...acc,
      ...curr,
    };
  }, {}) as SxProps<Theme>;
};

export { mergeSxProps };
