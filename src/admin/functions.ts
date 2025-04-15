import * as mailConfig from "@elvora/constants/email";
import { MailTransportConfig } from "@elvora/types";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";

const createMailTransport = (config?: MailTransportConfig) => {
  if (!config) {
    config = getMailConfig();
  }

  return nodemailer.createTransport({
    host: config.host!,
    port: config.port,
    auth: config.auth,
    tls: {
      rejectUnauthorized: false,
    },
    secure: config.secure,
  });
};

const getMailConfig = (): MailTransportConfig => {
  return {
    host: mailConfig.SMTP_HOST,
    port: Number(mailConfig.SMTP_PORT!),
    secure: false,
    auth: {
      user: mailConfig.SMTP_USERNAME,
      pass: mailConfig.SMTP_PASSWORD,
    },
    systemEmail: mailConfig.SYSTEM_EMAIL || mailConfig.SMTP_USERNAME,
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

  return nodemailerAdapter({
    transport: createMailTransport(config),
    defaultFromAddress: config.systemEmail!,
    defaultFromName: config.systemName,
  });
};

export { createMailAdapter, createMailTransport, mailConfig };
