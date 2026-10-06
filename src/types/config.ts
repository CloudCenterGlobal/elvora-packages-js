import SMTPConnection from "nodemailer/lib/smtp-connection";
import type { Config, TaskConfig } from "payload";

export type DbConfig = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
};

export type PayloadConfig = {
  db: DbConfig;
  email?: Config["email"];
  tasks?: TaskConfig[];
  admin?: Config["admin"];
};

export type MailTransportConfig = SMTPConnection.Options;
