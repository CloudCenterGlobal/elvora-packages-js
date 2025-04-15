"use client";

import { NextLink } from "@elvora/components/next-link";
import { notistackRef } from "@elvora/components/notistack";
import {
  RHFFormProvider,
  RHFMultiCheckbox,
  RHFMultiCheckboxProps,
  RHFRadioGroup,
  RHFSelectField,
  RHFSelectFieldProps,
  RHFTextField,
} from "@elvora/components/react-hook-form";
import { baseRoutes } from "@elvora/routes";
import { JobForm } from "@elvora/types/payload";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SubmitHandler, useForm } from "react-hook-form";
import { getFieldName, getSchema } from "./utils";

const RenderJobForm = ({ formData, onSubmit, values, disabled }: RenderJobFormProps) => {
  const { schema, defaultValues, fieldProps } = getSchema(formData, values);

  const methods = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues,
    disabled,
  });

  const handleSubmit: SubmitHandler<{}> = async (values) => {
    if (!onSubmit) {
      return notistackRef.current?.enqueueSnackbar({
        message: "This form is valid and ready to be submitted.",
        variant: "success",
      });
    }

    try {
      const response = await onSubmit?.(values);
      console.log("response", response);
    } catch (error) {
      console.error("Error submitting form", error);
      notistackRef.current?.enqueueSnackbar({
        message: "An error occurred while submitting the form.",
        variant: "error",
      });
    }
  };

  const _onSubmit = methods.handleSubmit(handleSubmit, () => {
    return notistackRef.current?.enqueueSnackbar({
      message: "Please ensure all fields are filled out correctly.",
      variant: "error",
    });
  });

  return (
    <RHFFormProvider methods={methods} onSubmit={_onSubmit} noWrap={disabled}>
      <Stack direction="column" spacing={2}>
        {formData.fields.map((field, index) => {
          const _props = fieldProps[getFieldName(index)];
          switch (field.fieldType) {
            case "select":
              return (
                <RHFSelectField<JobForm["form"]>
                  key={index}
                  {...(_props as RHFSelectFieldProps)}
                  name={getFieldName(index) as any}
                  label={field.label}
                  alternative={false}
                />
              );

            case "checkbox":
              return (
                <RHFMultiCheckbox<JobForm["form"]> key={index} {...(_props as RHFMultiCheckboxProps)} name={getFieldName(index) as any} label={field.label} />
              );
            case "radio":
              return (
                <RHFRadioGroup<JobForm["form"]> key={index} {...(_props as RHFMultiCheckboxProps)} name={getFieldName(index) as any} label={field.label} />
              );

            case "text":
            case "longText":
            case "email":
            case "number":
            case "url":
            default:
              return (
                <RHFTextField<JobForm["form"]>
                  key={index}
                  {...fieldProps[getFieldName(index)]}
                  name={getFieldName(index) as any}
                  label={field.label}
                  alternative={false}
                  defaultLabelStyle={false}
                />
              );
          }
        })}
      </Stack>

      {!disabled && (
        <Stack mt={3} spacing={2} alignItems="center" className="form-actions">
          <LoadingButton type="submit" disableElevation loading={methods.formState.isSubmitting} variant="contained" color="primary">
            Complete Application
          </LoadingButton>

          <Typography
            variant="caption"
            color="text.alt"
            sx={{
              a: {
                fontWeight: 600,
              },
            }}
          >
            By clicking "Complete Application", you agree to our{" "}
            <NextLink underline="hover" href={baseRoutes.termsAndConditions.root} color="inherit">
              Terms & Conditions{" "}
            </NextLink>{" "}
            and{" "}
            <NextLink href={baseRoutes.privacyPolicy.root} underline="hover" color="inherit">
              Privacy Policy{" "}
            </NextLink>
          </Typography>
        </Stack>
      )}
    </RHFFormProvider>
  );
};

export type RenderJobFormProps = {
  formData: JobForm["form"];
  onSubmit?: SubmitHandler<{
    [key: string]: any;
  }>;
  values?: JobForm["form"];
  disabled?: boolean;
};

export { RenderJobForm };
