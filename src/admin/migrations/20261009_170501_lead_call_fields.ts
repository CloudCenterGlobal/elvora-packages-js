import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_property_partners_qualification_result" AS ENUM('pass', 'decline');
  CREATE TYPE "public"."enum_forms_property_partners_call_status" AS ENUM('booked', 'failed', 'not_scheduled', 'cancelled');
  CREATE TABLE "forms_property_partners_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_id" varchar,
  	"question" varchar,
  	"answer" varchar
  );
  
  ALTER TABLE "forms_property_partners" ADD COLUMN "qualification_form_version" numeric;
  ALTER TABLE "forms_property_partners" ADD COLUMN "qualification_result" "enum_forms_property_partners_qualification_result";
  ALTER TABLE "forms_property_partners" ADD COLUMN "qualification_score" numeric;
  ALTER TABLE "forms_property_partners" ADD COLUMN "qualification_max_score" numeric;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_status" "enum_forms_property_partners_call_status";
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_scheduled_at" timestamp(3) with time zone;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_timezone" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_failure_reason" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "call_calendly_invitee_uri" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_utm_source" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_utm_campaign" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_utm_content" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_fbclid" varchar;
  ALTER TABLE "forms_property_partners_answers" ADD CONSTRAINT "forms_property_partners_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_property_partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_property_partners_answers_order_idx" ON "forms_property_partners_answers" USING btree ("_order");
  CREATE INDEX "forms_property_partners_answers_parent_id_idx" ON "forms_property_partners_answers" USING btree ("_parent_id");
  CREATE INDEX "forms_property_partners_call_call_status_idx" ON "forms_property_partners" USING btree ("call_status");
  CREATE INDEX "forms_property_partners_call_call_calendly_invitee_uri_idx" ON "forms_property_partners" USING btree ("call_calendly_invitee_uri");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_property_partners_answers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_property_partners_answers" CASCADE;
  DROP INDEX "forms_property_partners_call_call_status_idx";
  DROP INDEX "forms_property_partners_call_call_calendly_invitee_uri_idx";
  ALTER TABLE "forms_property_partners" DROP COLUMN "qualification_form_version";
  ALTER TABLE "forms_property_partners" DROP COLUMN "qualification_result";
  ALTER TABLE "forms_property_partners" DROP COLUMN "qualification_score";
  ALTER TABLE "forms_property_partners" DROP COLUMN "qualification_max_score";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_status";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_scheduled_at";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_timezone";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_failure_reason";
  ALTER TABLE "forms_property_partners" DROP COLUMN "call_calendly_invitee_uri";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_utm_source";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_utm_campaign";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_utm_content";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_fbclid";
  DROP TYPE "public"."enum_forms_property_partners_qualification_result";
  DROP TYPE "public"."enum_forms_property_partners_call_status";`)
}
