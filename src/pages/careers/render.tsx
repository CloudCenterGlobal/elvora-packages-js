"use client";

import { RenderJobForm, RenderJobFormProps } from "@elvora/admin/builder";
import { onCompleteAssessmentSubmit } from "@elvora/admin/server-actions/careers";
import { notistackRef } from "@elvora/components/notistack";
import { useRouter } from "next/navigation";
import { careers } from "@elvora/routes";

const RenderForm = (props: RenderFormProps) => {
  const { replace } = useRouter();

  const onSubmit: RenderJobFormProps["onSubmit"] = async (data) => {
    return onCompleteAssessmentSubmit({
      application_id: props.application_id,
      job_uuid: props.job_uuid,
      fields: props.formData.fields,
      answers: data,
    })
      .then((response) => {
        notistackRef.current?.enqueueSnackbar({
          message: "Your application has been submitted successfully.",
          variant: "success",
        });
        return replace(careers.detail(props.job_uuid, true));
      })
      .catch((error) => {
        console.error(error);

        notistackRef.current?.enqueueSnackbar({
          message: "There was an error submitting your application. Please try again.",
          variant: "error",
        });
      });
  };

  return <RenderJobForm {...props} onSubmit={onSubmit} />;
};

export type RenderFormProps = Omit<RenderJobFormProps, "onSubmit"> & {
  application_id: string;
  job_uuid: string;
};

export { RenderForm };
