/**
 * Services offered on the referral form's service checklist. Kept here as
 * plain option values since this package can't import from the consuming app.
 */
export const REFERRAL_SERVICE_OPTIONS = [
  { label: "Supported Living", value: "supported-living" },
  { label: "Residential", value: "residential" },
  { label: "Community Outreach", value: "community-outreach" },
] as const;

/**
 * Areas offered on the property partners form. Mirrors the consuming app's
 * investment-areas content, same reasoning as the referral services above.
 */
export const INVESTMENT_AREA_OPTIONS = [
  { label: "Staffordshire & Stoke-on-Trent", value: "staffordshire-stoke" },
  { label: "Warwickshire", value: "warwickshire" },
  { label: "West Northamptonshire", value: "west-northamptonshire" },
  { label: "Coventry", value: "coventry" },
  { label: "Shropshire and Telford & Wrekin", value: "shropshire-telford-wrekin" },
  { label: "Leicestershire", value: "leicestershire" },
] as const;

/**
 * How someone can be contacted for a requested callback. Kept as plain
 * option values (not a DB enum) for the same reason as the referral
 * services above — this package can't import from the consuming app, and
 * the set can change without needing a migration.
 */
export const CALLBACK_METHOD_OPTIONS = [
  { label: "Microsoft Teams", value: "teams" },
  { label: "Phone Call", value: "phone" },
] as const;
