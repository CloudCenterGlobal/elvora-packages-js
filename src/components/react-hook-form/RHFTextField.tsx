"use client";

import { mergeSxProps } from "@elvora/utils/sx";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import classnames from "classnames";
import * as React from "react";
import { useMemo } from "react";
import { Path, useController, useFormContext } from "react-hook-form";
import { alternative_sx } from "./utils";

const _isDate = (props: Partial<TextFieldProps>) => {
  const type =
    props.type ||
    props.type ||
    // @ts-ignore
    props.slotProps?.htmlInput?.type ||
    // @ts-ignore
    props.slotProps?.htmlInput?.type;

  return type === "date" || type === "datetime-local";
};

const RHFTextField = <T extends object>({
  name,
  disabled,
  defaultLabelStyle,
  color = "secondary",
  alternative = true,
  helperText,
  datePickerProps,
  label,
  ...props
}: RHFTextFieldProps<T>) => {
  const { control } = useFormContext<T>();

  const classNames = classnames({
    alternative: !!alternative,
    defaultLabelStyle: !!defaultLabelStyle,
  });

  const controller = useController<T>({ name, control });

  const isDate = _isDate(props);

  const commonProps = useMemo(() => {
    return {
      className: classNames,
      error: !!controller.fieldState.error,
      disabled: !!disabled,
      fullWidth: true,
      variant: "outlined",
      color: color,
      label: defaultLabelStyle ? label : null,
      helperText: controller.fieldState.error?.message ?? helperText,
      sx: mergeSxProps(alternative_sx, props.sx),
      ...props,
      ...controller.field,
    };
  }, [classNames, controller.field, controller.fieldState.error, color, defaultLabelStyle, disabled, helperText, label, props.sx, props]);

  const field = (() => {
    if (isDate) {
      return (
        <DatePicker
          enableAccessibleFieldDOMStructure
          {...datePickerProps}
          {...(commonProps as DatePickerProps<any, boolean>)}
          value={(commonProps.value || null) as unknown as Date}
        />
      );
    }
    return <TextField {...(commonProps as TextFieldProps)} />;
  })();

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

  datePickerProps?: Partial<DatePickerProps<any, boolean>>;
} & Omit<TextFieldProps, "name">;

export { RHFTextField };
