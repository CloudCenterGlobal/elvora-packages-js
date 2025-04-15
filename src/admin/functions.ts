import * as mailConfig from "@elvora/constants/email";
import { MailTransportConfig } from "@elvora/types";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";

const createMailTransport = (config?: MailTransportConfig) => {
  if (!config) {
    config = getMailConfig();
  }

  return nodemailer.createTransport(config);
};

const getMailConfig = (): MailTransportConfig => {
  return {
    host: mailConfig.SMTP_HOST,
    port: Number(mailConfig.SMTP_PORT!),
    secure: false,
    requireTLS: true,
    auth: {
      user: mailConfig.SMTP_USERNAME,
      pass: mailConfig.SMTP_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
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
    defaultFromAddress: mailConfig.SYSTEM_EMAIL,
    defaultFromName: mailConfig.SYSTEM_NAME,
    skipVerify: true,
  });
};

export { createMailAdapter, createMailTransport, mailConfig };
