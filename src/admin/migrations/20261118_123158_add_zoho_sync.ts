import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_property_partners_zoho_status" AS ENUM('pending', 'synced', 'failed', 'skipped');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'sync-zoho-lead';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'sync-zoho-lead';
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_status" "enum_forms_property_partners_zoho_status";
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_lead_id" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_note_id" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_synced_at" timestamp(3) with time zone;
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_attempts" numeric DEFAULT 0;
  ALTER TABLE "forms_property_partners" ADD COLUMN "zoho_last_error" varchar;
  CREATE INDEX "forms_property_partners_zoho_zoho_status_idx" ON "forms_property_partners" USING btree ("zoho_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'send-email', 'send-form-submission-notification', 'send-user-invitation');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'send-email', 'send-form-submission-notification', 'send-user-invitation');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "forms_property_partners_zoho_zoho_status_idx";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_status";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_lead_id";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_note_id";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_synced_at";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_attempts";
  ALTER TABLE "forms_property_partners" DROP COLUMN "zoho_last_error";
  DROP TYPE "public"."enum_forms_property_partners_zoho_status";`)
}
