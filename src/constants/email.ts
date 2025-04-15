export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_USERNAME = process.env.SMTP_USERNAME || "";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";

export const SMTP_SECURE = process.env.SMTP_SECURE?.toLowerCase() === "true" || true;

export const SYSTEM_EMAIL = process.env.SYSTEM_EMAIL;

export const SYSTEM_NAME = process.env.SYSTEM_NAME || "Admin";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const RECRUITMENT_EMAIL = process.env.RECRUITMENT_EMAIL || SYSTEM_EMAIL;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMTP_PORT: string;
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;

      SYSTEM_EMAIL: string;
      SYSTEM_NAME: string;
      SMTP_SECURE: "true" | string;

      RECRUITMENT_EMAIL: string;
    }
  }
}
