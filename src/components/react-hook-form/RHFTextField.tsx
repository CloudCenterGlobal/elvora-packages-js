"use client";

import { mergeSxProps } from "@elvora/utils/sx";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import classnames from "classnames";
import { useMemo } from "react";
import { Path, useController, useFormContext } from "react-hook-form";
import { alternative_sx } from "./utils";

const RHFTextField = <T extends object>({
  name,
  disabled,
  defaultLabelStyle,
  color = "secondary",
  alternative = true,
  helperText,
  label,
  ...props
}: RHFTextFieldProps<T>) => {
  const { control } = useFormContext<T>();

  const classNames = classnames({
    alternative: !!alternative,
    defaultLabelStyle: !!defaultLabelStyle,
  });

  const controller = useController<T>({ name, control });

  const field = useMemo(() => {
    return (
      <TextField
        className={classNames}
        color={color}
        disabled={disabled}
        fullWidth
        variant="outlined"
        {...props}
        error={!!controller.fieldState.error}
        helperText={controller.fieldState.error?.message ?? helperText}
        label={defaultLabelStyle ? label : null}
        sx={mergeSxProps(alternative_sx, props.sx)}
        {...controller.field}
      />
    );
  }, [classNames, color, disabled, helperText, defaultLabelStyle, label, props, controller.field]);

  if (!defaultLabelStyle) {
    return (
      <FormControl error={!!controller.fieldState.error} required={!!props.required} fullWidth sx={mergeSxProps(alternative_sx, props.sx)}>
        {renderLabel(defaultLabelStyle, label, props)}
        {field}
      </FormControl>
    );
  }

  return field;
};

const renderLabel = (defaultLabelStyle: boolean | undefined, label: React.ReactNode, props: TextFieldProps) => {
  if (!defaultLabelStyle && label) {
    return (
      <FormLabel required={!!props.required} color={props.color}>
        {label}
      </FormLabel>
    );
  }
};

export type RHFTextFieldProps<T extends object = object> = {
  name: Path<T>;
  alternative?: boolean;
  defaultLabelStyle?: boolean;
  helperText?: React.ReactNode;
} & Omit<TextFieldProps, "name">;

export { RHFTextField };
