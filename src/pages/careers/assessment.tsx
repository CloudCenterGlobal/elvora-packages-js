import {
  getJobApplicationById,
  getJobFormByJobUUID,
} from "@elvora/admin/server-actions/jobs";
import PageContainer from "@elvora/components/page-container";
import SectionSpacer, {
  SECTION_SPACER_SMALL,
  SECTION_SPACER_SMALLER,
} from "@elvora/components/section-spacer";
import { JobPosting } from "@elvora/types";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { notFound } from "next/navigation";
import { RenderForm } from "./render";
import { isJobOpenForApplications } from "./utils";

const CareersAssessmentPageBase: React.FC<Props> = async ({
  landing,
  job,
  application,
  onApplicationSuccess,
}) => {
  if (Object.keys(application?.assessment?.answers ?? {}).length > 0) {
    return onApplicationSuccess();
  }

  if (!application) {
    return notFound();
  }

  if (
    !job ||
    !job.job_questions ||
    isJobOpenForApplications(job as JobPosting)
  ) {
    return notFound();
  }

  return (
    <Box sx={sx}>
      {landing}

      <div className="form-container">
        <PageContainer maxWidth="lg" ignoreNavHeight transparent>
          <Typography variant="overline" color="common.red">
            APPLYING FOR
          </Typography>
          <Typography variant="h3" fontWeight={500}>
            {job.role}
          </Typography>

          <Typography variant="body2" color="text.alt">
            Please fill in the form below to complete your application.
          </Typography>

          <SectionSpacer smaller />

          <RenderForm
            formData={job.job_questions.form}
            application_id={application.id as unknown as string}
            job_uuid={job.uuid!}
          />
        </PageContainer>
      </div>
    </Box>
  );
};

const sx: SxProps = {
  "& .form-container": {
    flex: 1,
    bgcolor: "background.neutral",
    // boxShadow: 12,
    "& .page-container": {
      paddingTop: SECTION_SPACER_SMALL,
      paddingBottom: SECTION_SPACER_SMALLER,

      "& .form-actions": {
        justifyContent: {
          xs: "center",
          md: "flex-end",
        },
      },
    },
  },
};

export type Props = {
  landing: React.ReactNode;

  job: Awaited<ReturnType<typeof getJobFormByJobUUID>>;
  application: Awaited<ReturnType<typeof getJobApplicationById>>;

  onApplicationSuccess: () => never;
};

export default CareersAssessmentPageBase;
