import { CareersApplicationForm } from "@elvora/components/forms/carrers/application";
import { LexicalChildren } from "@elvora/components/lexical";
import { ApplicationSuccessDialog, ApplicationSuccessDialogProps } from "@elvora/components/modals";
import PageContainer from "@elvora/components/page-container";
import SectionSpacer, { SECTION_SPACER_SMALL } from "@elvora/components/section-spacer";
import { JobLocation, JobPosting } from "@elvora/types/payload";
import { responsive } from "@elvora/utils/breakpoints";
import { fDate } from "@elvora/utils/formatDate";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import { notFound } from "next/navigation";
import { cloneElement } from "react";

export const getJobDetailsItems = (job: JobPosting) => {
  return [
    {
      title: "Job Types",
      value:
        job.metadata?.job_types.reduce((a, current, index) => {
          if (index === 0) {
            return capitalCase(current);
          }
          return a + ", " + capitalCase(current);
        }, "" as any) || "",
    },
    {
      title: "Location",
      value: (job.metadata?.job_location as JobLocation)?.location || "",
    },
    ...(job.job_expiration
      ? [
          {
            title: "Application Deadline",
            value: job.job_expiration ? fDate(job.job_expiration) : "N/A",
          },
        ]
      : []),
    ...(job.metadata?.min_pay
      ? [
          {
            title: "Pay",
            value: job.metadata?.min_pay ? `£${job.metadata?.min_pay} ${job.metadata?.max_pay ? "to " + job.metadata?.max_pay : ""} per hour` : "-",
          },
        ]
      : []),

    ...(job.start_date
      ? [
          {
            title: "Start Date",
            value: job.start_date ? fDate(job.start_date) : "Soon",
          },
        ]
      : []),
  ];
};

const CareersDetailPageBase: React.FC<CareersDetailPageBaseProps> = async ({ landing, params, searchParams, job }) => {
  const { job_uuid } = await params;
  const { application_success } = await searchParams;

  if (!job) {
    return notFound();
  }

  return (
    <>
      {landing}

      <Box sx={sx}>
        <PageContainer ignoreNavHeight transparent>
          <div>
            <Typography variant="overline" color="common.red">
              APPLY FOR
            </Typography>

            <Typography variant="h3" fontWeight={500} gutterBottom>
              {job.role}
            </Typography>

            <Stack direction="row">
              {cloneElement(<CalendarTodayRounded />, {
                color: "primary",
                sx: { fontSize: 18 },
              })}
              <Typography variant="caption" ml={1} lineHeight={1.5} color="text.secondary" fontWeight={500}>
                {fDate(job.createdAt)}
              </Typography>

              {/*  */}

              {cloneElement(<PersonOutlined />, {
                color: "primary",
                sx: { fontSize: 18, ml: 2 },
              })}
              <Typography variant="caption" ml={1} lineHeight={1.5} color="text.secondary" fontWeight={500}>
                {job.role}
              </Typography>
            </Stack>
          </div>

          <SectionSpacer small />

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >
            <Stack spacing={0} maxWidth="md" flex={1}>
              <div>
                <Grid2 container maxWidth="md" spacing={0.5}>
                  {getJobDetailsItems(job).map((item, index) => (
                    <Grid2 size={{ xs: 12, md: 6 }} key={index} spacing={1}>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" color="text.primary" fontWeight={600} component="p">
                          {item.title}:
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={400} component="p">
                          {item.value}
                        </Typography>
                      </Stack>
                    </Grid2>
                  ))}
                </Grid2>

                <SectionSpacer smaller />
              </div>

              {job.details?.description.root.children.map((item, index) => {
                return <LexicalChildren data={item as any} key={index} />;
              })}
            </Stack>

            <CareersApplicationForm uuid={job_uuid} className="application-form-container" hasQuestions={!!job.job_questions} />
          </Stack>
        </PageContainer>
      </Box>

      <ApplicationSuccessDialog application_success={application_success} />
    </>
  );
};

const sx: SxProps = {
  bgcolor: "background.neutral",
  py: SECTION_SPACER_SMALL,

  [responsive("down", "md")]: {
    "& .application-form-container": {
      mt: 2,
      borderTop: "1px solid",
      borderColor: "divider",
    },
  },
};

export type CareersDetailPageBaseProps = {
  params: Promise<{
    job_uuid: string;
  }>;
  searchParams: Promise<{
    application_success: ApplicationSuccessDialogProps["application_success"];
  }>;
  job: JobPosting;
  landing: React.ReactNode;
};

export { CareersDetailPageBase };
