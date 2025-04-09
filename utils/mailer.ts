"use server";
import type { SendMailOptions } from "nodemailer";
import { createMailTransport, mailConfig } from "../admin/functions";

const sendMail = async (data: SendEmailConfig) => {
  const transporter = await createMailTransport();

  return await transporter.sendMail({
    from: mailConfig.SYSTEM_EMAIL,
    ...data,
    to: data.to || mailConfig.SYSTEM_EMAIL,
    attachments: data.attachments,
  });
};

export type SendEmailConfig = { to?: string; subject: string; html: string; cc?: string; attachments?: SendMailOptions["attachments"] };
export { createMailTransport, sendMail };
