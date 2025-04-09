export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";

export const SMTP_SECURE = process.env.SMTP_SECURE?.toLowerCase() === "true" || false;

export const SYSTEM_EMAIL = process.env.SYSTEM_EMAIL;

export const SYSTEM_NAME = process.env.SYSTEM_NAME || "Admin";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMTP_PORT: string;
      SMTP_HOST: string;
      SMTP_USER: string;
      SMTP_PASS: string;

      SYSTEM_EMAIL: string;
      SYSTEM_NAME: string;
      SMTP_SECURE: "true" | string;
    }
  }
}
