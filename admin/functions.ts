import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";
import * as mailConfig from "../constants/email";
import { MailTransportConfig } from "./types/config";

const createMailTransport = (config?: MailTransportConfig) => {
  if (!config) {
    config = getMailConfig();
  }

  return nodemailer.createTransport({
    host: config.host!,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    requireTLS: true,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
};

const getMailConfig = (): MailTransportConfig => {
  return {
    host: mailConfig.SMTP_HOST,
    port: Number(mailConfig.SMTP_PORT!),
    secure: process.env.SMTP_SECURE?.toLowerCase() === "true" || false,
    auth: {
      user: mailConfig.SMTP_USER,
      pass: mailConfig.SMTP_PASS,
    },
    systemEmail: mailConfig.SYSTEM_EMAIL,
    systemName: mailConfig.SYSTEM_NAME,
  };
};

const createMailAdapter = (config?: MailTransportConfig) => {
  if (!config) {
    config = getMailConfig();
  }

  if (!config.host || !config.port) {
    return undefined;
  }

  const transport = createMailTransport(config);
  return nodemailerAdapter({
    transport,
    defaultFromAddress: config.systemEmail,
    defaultFromName: config.systemName,
    skipVerify: true,
  });
};

export { createMailAdapter, createMailTransport, mailConfig };
