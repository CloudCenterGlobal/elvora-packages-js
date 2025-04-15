import type { Config } from "payload";

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
};

export type MailTransportConfig = {
  systemEmail: string;
  systemName: string;

  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};
