"use server";

import nodemailer, { SendMailOptions } from "nodemailer";
import { EMAILS, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE, SMTP_USERNAME, SYSTEM_EMAIL } from "../../../src/utils/constants/email";

const createMailTransport = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST!,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
    requireTLS: true,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
};

const sendMail = async (data: SendEmailConfig) => {
  const transporter = createMailTransport();

  return await transporter.sendMail({
    from: SYSTEM_EMAIL,
    ...data,
    to: data.to || SYSTEM_EMAIL,
    attachments: data.attachments,
  });
};

const sendFormSubmissionMail = async (data: Omit<SendEmailConfig, "cc">) => {
  return sendMail({
    ...data,
    subject: data.subject.includes("Webform Submission") ? data.subject : `${data.subject} - Webform Submission`,
    to: data.to || EMAILS.hamid,
    ...(EMAILS.booking !== SYSTEM_EMAIL && { cc: EMAILS.booking }),
  });
};

type SendEmailConfig = { to?: string; subject: string; html: string; cc?: string; attachments?: SendMailOptions["attachments"] };
export { createMailTransport, sendFormSubmissionMail, sendMail };
