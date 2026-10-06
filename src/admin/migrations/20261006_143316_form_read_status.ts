import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_referrals_status" AS ENUM('unread', 'read');
  CREATE TYPE "public"."enum_forms_callbacks_status" AS ENUM('unread', 'read');
  CREATE TYPE "public"."enum_forms_property_partners_status" AS ENUM('unread', 'read');
  CREATE TYPE "public"."enum_forms_contacts_status" AS ENUM('unread', 'read');
  ALTER TABLE "forms_referrals" ADD COLUMN "status" "enum_forms_referrals_status" DEFAULT 'unread';
  ALTER TABLE "forms_callbacks" ADD COLUMN "status" "enum_forms_callbacks_status" DEFAULT 'unread';
  ALTER TABLE "forms_property_partners" ADD COLUMN "status" "enum_forms_property_partners_status" DEFAULT 'unread';
  ALTER TABLE "forms_contacts" ADD COLUMN "status" "enum_forms_contacts_status" DEFAULT 'unread';
  CREATE INDEX "forms_referrals_status_idx" ON "forms_referrals" USING btree ("status");
  CREATE INDEX "forms_callbacks_status_idx" ON "forms_callbacks" USING btree ("status");
  CREATE INDEX "forms_property_partners_status_idx" ON "forms_property_partners" USING btree ("status");
  CREATE INDEX "forms_contacts_status_idx" ON "forms_contacts" USING btree ("status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "forms_referrals_status_idx";
  DROP INDEX "forms_callbacks_status_idx";
  DROP INDEX "forms_property_partners_status_idx";
  DROP INDEX "forms_contacts_status_idx";
  ALTER TABLE "forms_referrals" DROP COLUMN "status";
  ALTER TABLE "forms_callbacks" DROP COLUMN "status";
  ALTER TABLE "forms_property_partners" DROP COLUMN "status";
  ALTER TABLE "forms_contacts" DROP COLUMN "status";
  DROP TYPE "public"."enum_forms_referrals_status";
  DROP TYPE "public"."enum_forms_callbacks_status";
  DROP TYPE "public"."enum_forms_property_partners_status";
  DROP TYPE "public"."enum_forms_contacts_status";`)
}
