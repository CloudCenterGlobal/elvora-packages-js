import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_property_partners_partner_type" AS ENUM('property', 'housing');
  ALTER TABLE "forms_property_partners" ADD COLUMN "partner_type" "enum_forms_property_partners_partner_type" DEFAULT 'property';
  CREATE INDEX "forms_property_partners_partner_type_idx" ON "forms_property_partners" USING btree ("partner_type");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "forms_property_partners_partner_type_idx";
  ALTER TABLE "forms_property_partners" DROP COLUMN "partner_type";
  DROP TYPE "public"."enum_forms_property_partners_partner_type";`)
}
