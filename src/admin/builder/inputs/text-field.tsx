import { JobFormValues } from "@elvora/types";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextInput } from "@payloadcms/ui";
import isEqual from "lodash/isEqual";
import { memo } from "react";
import { Path } from "react-hook-form";
import { useFormBuilderContext } from "../context";

const StyledTextInput = styled(TextInput)(() => ({
  width: "100%",
  "& input": {
    boxShadow: "none",
    paddingY: 0,
    height: 40,
  },
}));

const _PayloadTextField = <T extends Path<JobFormValues>>({
  name,
  ...props
}: PayloadTextFieldProps<
  T & {
    [key: string]: any;
  }
>) => {
  const { watch, setFormValue, getFieldError } = useFormBuilderContext();
  const value = watch(name as any);
  const error = getFieldError(name as any);

  return (
    <Stack>
      <StyledTextInput
        path={name}
        onChange={(e: any) => {
          setFormValue(name as any, e.target.value);
        }}
        value={value as string | undefined}
        showError={!!error?.message}
        {...props}
      />
      {!!error?.message && (
        <Typography variant="body2" color="var(--theme-error-500) !important">
          {error?.message}
        </Typography>
      )}
    </Stack>
  );
};

export type PayloadTextFieldProps<T extends {}, X = Path<T>> = {
  name: X;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PayloadTextField = memo(
  _PayloadTextField,

  (prevProps, nextProps) => {
    return isEqual(prevProps.name, nextProps.name);
  }
) as <T extends Path<JobFormValues>>(
  props: PayloadTextFieldProps<T> & {
    [key: string]: any;
  }
) => React.JSX.Element;

export { PayloadTextField };
