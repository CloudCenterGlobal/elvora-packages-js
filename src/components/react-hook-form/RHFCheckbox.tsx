"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import { Controller, Path, useFormContext } from "react-hook-form";
import { Options } from "./types";
import { getOption } from "./utils";

const RenderHelperText = ({ error, helperText }: { error?: string; helperText?: React.ReactNode }) => {
  if (!error && !helperText) return null;
  return <FormHelperText error={!!error}>{error || helperText}</FormHelperText>;
};

const RHFCheckbox = <FormValues extends { [key: string]: any } = object>({ name, label, ...props }: RHFCheckboxProps<FormValues>) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <FormControlLabel
            control={<Checkbox {...field} onChange={(_, checked) => field.onChange(checked)} />}
            label={label}
            slotProps={{
              typography: {
                variant: "body2",
              },
            }}
          />
          <RenderHelperText error={fieldState?.error?.message} helperText={props.helperText} />
        </div>
      )}
    />
  );
};

const RHFMultiCheckbox = <FormValues extends { [key: string]: any } = object>({ name, label, options, ...props }: RHFMultiCheckboxProps<FormValues>) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl color="secondary" error={!!fieldState.error} required={!!props.required}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <RadioGroup {...field}>
            {options.map((_option) => {
              const option = getOption(_option);
              return (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  checked={field.value?.includes(option.value)}
                  disabled={field.disabled}
                  onChange={(e) => {
                    if (field.disabled) {
                      e.stopPropagation();
                      e.preventDefault();
                      return;
                    }
                    const newValue = field.value?.includes(option.value)
                      ? field.value.filter((v: string) => v !== option.value)
                      : [...(field.value || []), option.value];
                    field.onChange(newValue);
                  }}
                  control={<Checkbox color="secondary" />}
                />
              );
            })}
          </RadioGroup>
          {(props.helperText || fieldState?.error) && (
            <FormHelperText error={!!fieldState.error}>{fieldState.error?.message || props.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

const RHFSwitch = <FormValues extends { [key: string]: any } = object>({ name, label, ...props }: RHFCheckboxProps<FormValues>) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <FormControlLabel
            control={<Switch {...field} onChange={(_, checked) => field.onChange(checked)} />}
            label={label}
            slotProps={{
              typography: {
                variant: "body2",
              },
            }}
          />
          {(props.helperText || fieldState?.error) && (
            <FormHelperText error={!!fieldState.error}>{fieldState.error?.message || props.helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

const RHFRadioGroup = <FormValues extends { [key: string]: any } = object>({ name, label, options, required, ...props }: RHFRadioGroupProps<FormValues>) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} required={required}>
          {!!label && (
            <FormLabel required={required} error={!!fieldState.error}>
              {label}
            </FormLabel>
          )}
          <RadioGroup {...props} {...field}>
            {options.map((_option) => {
              const option = getOption(_option);
              return <FormControlLabel value={option.value} label={option.label} key={option.value} control={<Radio />} />;
            })}
          </RadioGroup>
          {(props.helperText || fieldState?.error) && (
            <FormHelperText error={!!fieldState.error}>{fieldState.error?.message || props.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export type RHFRadioGroupProps<FormValues extends { [key: string]: any }> = {
  name: Path<FormValues>;
  label: React.ReactNode;
  options: Options;
  helperText?: React.ReactNode;
} & Omit<FormControlProps & RadioGroupProps, "error">;

export type RHFCheckboxProps<FormValues extends { [key: string]: any } = {}> = {
  name: Path<FormValues>;
  label: React.ReactNode;
  helperText?: React.ReactNode;
};

export type RHFMultiCheckboxProps<FormValues extends { [key: string]: any } = {}> = {
  name: Path<FormValues>;
  label: React.ReactNode;
  options: Options;
  helperText?: React.ReactNode;
} & Omit<FormControlProps, "error">;

export { RHFCheckbox, RHFMultiCheckbox, RHFRadioGroup, RHFSwitch };
