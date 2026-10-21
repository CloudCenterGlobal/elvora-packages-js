import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "forms_property_partners_call_call_status_idx";
  DROP INDEX "forms_property_partners_call_call_calendly_invitee_uri_idx";
  ALTER TABLE "forms_property_partners" DROP COLUMN "property_location";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_status";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_scheduled_at";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_timezone";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_failure_reason";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_calendly_invitee_uri";
  DROP TYPE "public"."enum_forms_property_partners_call_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_property_partners_call_status" AS ENUM('booked', 'failed', 'not_scheduled', 'cancelled');
  ALTER TABLE "forms_property_partners" ADD COLUMN "property_location" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_status" "enum_forms_property_partners_call_status";
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_scheduled_at" timestamp(3) with time zone;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_timezone" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_failure_reason" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_calendly_invitee_uri" varchar;
  CREATE INDEX "forms_property_partners_call_call_status_idx" ON "forms_property_partners" USING btree ("call_status");
  CREATE INDEX "forms_property_partners_call_call_calendly_invitee_uri_idx" ON "forms_property_partners" USING btree ("call_calendly_invitee_uri");`)
}
