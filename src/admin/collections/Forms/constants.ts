/**
 * Services offered on the referral form's service checklist. Kept here as
 * plain option values since this package can't import from the consuming app.
 */
export const REFERRAL_SERVICE_OPTIONS = [
  { label: "Supported Living", value: "supported-living" },
  { label: "Residential", value: "residential" },
  { label: "Community Outreach", value: "community-outreach" },
] as const;
