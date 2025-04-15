"use client";

import { onCareerApplicationSubmit } from "@elvora/admin/server-actions/careers";
import { NextLink } from "@elvora/components/next-link";
import { notistackRef } from "@elvora/components/notistack";
import { RHFFormProvider, RHFTextField, RHFUploadSingleFile } from "@elvora/components/react-hook-form";
import { responsive } from "@elvora/utils/breakpoints";
import cssStyles from "@elvora/utils/cssStyles";
import { fData } from "@elvora/utils/formatNumber";
import { mergeSxProps } from "@elvora/utils/sx";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Box, { BoxProps } from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//@ts-ignore
import pattern from "@elvora/assets/get-in-touch/pattern.png";
import { SECTION_SPACER_SMALLER } from "@elvora/components/section-spacer";
import type { FileUpload } from "@elvora/components/upload";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { baseRoutes } from "@elvora/routes";
import { SxProps } from "@mui/material/styles";

export const MAX_SIZE = 4000 * 1000;

const schema = yup.object().shape({
  uuid: yup.string().required("UUID is required"),
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup.string().required("Mobile is required"),
  cv: yup
    .mixed<FileUpload>()
    .required("CV is required")
    .test({
      test(val) {
        return val && typeof val === "object";
      },
      message: "Please upload a file",
    }),
});

const CareersApplicationForm: React.FC<CareersApplicationFormProps> = ({ hasQuestions, uuid, ...props }) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    const response = await onCareerApplicationSubmit(values as any);

    if (response.error) {
      return notistackRef.current?.enqueueSnackbar(response.error, {
        variant: "error",
      });
    }

    notistackRef.current?.enqueueSnackbar("We have received your application. We will get back to you soon.", { variant: "success" });
    methods.reset();

    // make sure to add the ? to avoid errors if the function is not available
    // fbq("track", "Lead", { content_name: "Job Application" });

    return response;
  });

  const label = hasQuestions ? "Start Application" : "Apply Now";

  useEffect(() => {
    methods.setValue("uuid", uuid);
  }, [uuid]);

  return (
    <Box {...props} sx={mergeSxProps(sx, props.sx)}>
      <RHFFormProvider methods={methods} onSubmit={onSubmit}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          color="text.alt"
          sx={{
            marginTop: {
              xs: 3,
              md: 0,
            },
          }}
        >
          Complete The Form Below
        </Typography>

        <Stack spacing={3} mt={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <RHFTextField name="first_name" fullWidth label="First Name" defaultLabelStyle />
            <RHFTextField name="last_name" fullWidth label="Last Name" defaultLabelStyle />
          </Stack>

          <RHFTextField name="email" fullWidth label="Email" defaultLabelStyle type="email" autoComplete="email" />
          <RHFTextField name="mobile" fullWidth label="Contact Number" defaultLabelStyle placeholder="01234 567 890" />

          <RHFUploadSingleFile
            name="cv"
            label="Cv/Resume"
            helperText={`Upload a file no larger than ${fData(MAX_SIZE)}. Supported file types: .PDF .DOC`}
            accept={{
              docs: [".pdf", "doc", ".docx"],
            }}
            maxSize={MAX_SIZE}
          />
        </Stack>

        <Stack className="footer" spacing={1}>
          <Typography color="secondary.main" variant="caption" component="div" className="privacy-policy" px={1}>
            By clicking "{label}", you agree to our{" "}
            <NextLink underline="hover" href={baseRoutes.termsAndConditions.root} color="inherit">
              Terms & Conditions{" "}
            </NextLink>{" "}
            and{" "}
            <NextLink href={baseRoutes.privacyPolicy.root} underline="hover" color="inherit">
              Privacy Policy{" "}
            </NextLink>
          </Typography>

          <LoadingButton variant="contained" fullWidth type="submit" loading={methods.formState.isSubmitting}>
            {label}
          </LoadingButton>
        </Stack>
      </RHFFormProvider>
    </Box>
  );
};

const sx: SxProps = {
  backgroundImage: `url(${pattern.src})`,
  backgroundSize: 400,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom right",

  maxWidth: {
    xs: "100%",
    md: "md",
  },
  "& .drop-zone-wrapper": {
    ...cssStyles().bgBlur({
      color: "#ffffff",
      opacity: 0.1,
      blur: 1.5,
    }),
    boxShadow: 6,
  },

  "& .MuiTextField-root fieldset": {
    boxShadow: 6,
  },

  "& .privacy-policy": {
    "& a": {
      fontWeight: 600,
    },
  },

  [responsive("up", "md")]: {
    paddingLeft: 5,
    borderLeftWidth: 2,
    borderLeftColor: "common.white",
    borderLeftStyle: "solid",
  },

  "& .footer": {
    mt: SECTION_SPACER_SMALLER,
  },

  "& .input-file": {
    height: "auto",
    "& input": {
      height: 100,
      border: "1px solid",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    },
  },
};

const defaultValues: CareersApplicationFormValues = {
  uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  cv: "" as unknown as FileUpload,
};

// Types

export type CareersApplicationFormProps = {
  uuid: string;
  hasQuestions?: boolean;
} & BoxProps;

export type CareersApplicationFormValues = yup.InferType<typeof schema>;

export { CareersApplicationForm };
