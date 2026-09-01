/**
 * Mirrors the specialism ids/titles the referral form's service checklist
 * is built from (new-ignite-nursing-website's src/sections/specialisms-content.ts).
 * Kept here as plain option values since this package can't import from
 * the consuming app.
 */
export const REFERRAL_SERVICE_OPTIONS = [
  { label: "Supported Living & Residential", value: "supported-living-residential" },
  { label: "Complex Care & Transforming Care", value: "complex-care-transforming-care" },
  { label: "Hospital Discharge & Transition", value: "hospital-discharge-transition" },
  { label: "Learning Disabilities", value: "learning-disabilities" },
  { label: "Autism Spectrum Conditions", value: "autism-spectrum-conditions" },
  { label: "Behaviours that Challenge", value: "behaviours-that-challenge" },
  { label: "Positive Behaviour Support", value: "positive-behaviour-support" },
] as const;
