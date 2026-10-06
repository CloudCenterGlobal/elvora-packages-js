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

const createJobsConfig = (tasks: TaskConfig[] = []): JobsConfig => ({
  tasks: [sendEmailTask, ...tasks],
  autoRun: [{ cron: "*/5 * * * * *", limit: 10, queue: "default" }],
});

export { createJobsConfig, createQueuedMailAdapter, SEND_EMAIL_TASK, sendEmailTask };
