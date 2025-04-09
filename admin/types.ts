export type DbConfig = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
};

export type PayloadConfig = {
  db: DbConfig;
  email?: MailTransportConfig;
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
