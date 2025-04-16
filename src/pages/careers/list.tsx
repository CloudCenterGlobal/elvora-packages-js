import { CareerItemCard } from "@elvora/components/career-item-card";
import { NextLink } from "@elvora/components/next-link";
import PageContainer from "@elvora/components/page-container";
import SectionHeader from "@elvora/components/section-header";
import SectionSpacer, { SECTION_SPACER } from "@elvora/components/section-spacer";
import { baseRoutes } from "@elvora/routes";
import { CareersPageFilters } from "@elvora/sections/careers/filters";
import { JobPostingMini } from "@elvora/types/careers";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const CareersListPageBase: React.FC<CareersDetailPageBaseProps> = async ({ landing, jobs }) => {
  const hasJobs = jobs?.length > 0;

  return (
    <>
      {landing}

      <Box sx={sx}>
        <PageContainer ignoreNavHeight transparent>
          {!!hasJobs && (
            <>
              <SectionHeader
                title="Jobs Available Right Now"
                overline="START YOUR JOURNEY HERE"
                sx={{
                  alignItems: {
                    xs: "center",
                    md: "flex-start",
                  },
                  "& .MuiTypography-root": {
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                  },
                }}
              />

              <SectionSpacer smaller />

              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                <CareersPageFilters />
                <div style={{ width: "100%" }}>
                  <Grid2 container rowSpacing={4} columnSpacing={3}>
                    {jobs.map((item, index) => (
                      <Grid2
                        key={index}
                        size={{
                          xs: 12,
                          sm: 6,
                        }}
                      >
                        <NextLink href={baseRoutes.careers.detail(item.uuid!)} underline="none">
                          <CareerItemCard item={item} />
                        </NextLink>
                      </Grid2>
                    ))}
                  </Grid2>
                </div>
              </Stack>
            </>
          )}
          {!hasJobs && (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                No jobs available at the moment
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Please check back later or contact us for more information.
              </Typography>
            </>
          )}
        </PageContainer>
      </Box>
    </>
  );
};

const sx: SxProps = {
  paddingY: SECTION_SPACER,
  bgcolor: "background.neutral",

  "& .section-header .title": {
    fontWeight: 500,
  },
};

export type CareersDetailPageBaseProps = {
  jobs: JobPostingMini[];
  landing?: React.ReactNode;
};

export { CareersListPageBase };
