import * as mailConfig from "@elvora/constants/email";
import type { EmailAdapter, JobsConfig, SendEmailOptions, TaskConfig } from "payload";
import { createMailTransport } from "./functions";

const SEND_EMAIL_TASK = "send-email";

type QueuedEmailInput = {
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: { filename: string; path: string; contentType?: string }[];
};

const toAddressList = (value: SendEmailOptions["to"]) => {
  if (!value) return undefined;
  return (Array.isArray(value) ? value : [value]).map(String).join(", ");
};

const sendEmailTask: TaskConfig<"send-email"> = {
  slug: "send-email",
  retries: { attempts: 5, backoff: { type: "exponential", delay: 10_000 } },
  inputSchema: [
    { name: "from", type: "text" },
    { name: "to", type: "text" },
    { name: "cc", type: "text" },
    { name: "bcc", type: "text" },
    { name: "subject", type: "text", required: true },
    { name: "html", type: "textarea" },
    { name: "text", type: "textarea" },
    // Files are referenced by path and read from disk when the job runs, so the job row never holds file contents.
    { name: "attachments", type: "json" },
  ],
  handler: async ({ input }) => {
    const email = input as QueuedEmailInput;

    await createMailTransport().sendMail({
      ...email,
      from: email.from || `"${mailConfig.SYSTEM_NAME}" <${mailConfig.SYSTEM_EMAIL}>`,
      to: email.to || mailConfig.SYSTEM_EMAIL,
    });

    return { output: {} };
  },
};

/** Wraps an email adapter so every `payload.sendEmail` (auth emails included) is queued instead of sent inline. */
const createQueuedMailAdapter = (adapter: EmailAdapter | Promise<EmailAdapter> | undefined) => {
  if (!adapter) return undefined;

  return (async () => {
    const resolve = await adapter;

    const queued: EmailAdapter = (args) => {
      const initialized = resolve(args);

      return {
        ...initialized,
        sendEmail: async (message) => {
          await args.payload.jobs.queue({
            task: "send-email",
            input: {
              from: message.from as string | undefined,
              to: toAddressList(message.to),
              cc: toAddressList(message.cc),
              bcc: toAddressList(message.bcc),
              subject: message.subject ?? "",
              html: message.html as string | undefined,
              text: message.text as string | undefined,
            },
          });
        },
      };
    };

    return queued;
  })();
};

const isSuperAdmin = ({ req }: { req: { user?: { role?: string | null } | null } }) => req.user?.role === "super-admin";

/** Jobs are inspect-only: super-admins can view and delete them, but never create or edit them. */
const createJobsConfig = (tasks: TaskConfig[] = []): JobsConfig => ({
  tasks: [sendEmailTask, ...tasks],
  autoRun: [{ cron: "*/5 * * * * *", limit: 10, queue: "default" }],
  // Set to "false" where a dedicated worker (`pnpm run worker`) processes the queue instead.
  shouldAutoRun: () => process.env.PAYLOAD_JOBS_AUTORUN !== "false",
  jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
    ...defaultJobsCollection,
    access: {
      create: () => false,
      update: () => false,
      read: isSuperAdmin,
      delete: isSuperAdmin,
    },
    admin: {
      ...defaultJobsCollection.admin,
      hidden: false,
      group: "System",
      useAsTitle: "taskSlug",
      defaultColumns: ["taskSlug", "queue", "processing", "hasError", "totalTried", "createdAt", "completedAt"],
      description: "Queued background tasks such as emails. Failed tasks stay here with their error and are retried automatically.",
    },
  }),
});

export { createJobsConfig, createQueuedMailAdapter, SEND_EMAIL_TASK, sendEmailTask };
