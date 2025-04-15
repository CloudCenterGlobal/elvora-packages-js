import MenuItem from "@mui/material/MenuItem";
import { RHFTextField, RHFTextFieldProps } from "./RHFTextField";
import { Options } from "./types";
import { getOption } from "./utils";

const RHFSelectField = <T extends object = object>({ options, ...props }: RHFSelectFieldProps<T>) => {
  return (
    <RHFTextField {...props} select>
      {options.map((_option) => {
        const option = getOption(_option);

        return (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        );
      })}
    </RHFTextField>
  );
};

export type RHFSelectFieldProps<T extends object = object> = RHFTextFieldProps<T> & {
  options: Options;
};

export { RHFSelectField };
