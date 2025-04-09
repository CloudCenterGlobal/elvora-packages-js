import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";
import { MailTransportConfig } from "./types";

const createMailTransport = (config: MailTransportConfig) => {
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

const createMailAdapter = (config?: MailTransportConfig) => {
  if (!config) return undefined;

  const transport = createMailTransport(config);
  return nodemailerAdapter({
    transport,
    defaultFromAddress: config.systemEmail,
    defaultFromName: config.systemName,
    skipVerify: true,
  });
};

export { createMailAdapter, createMailTransport };
