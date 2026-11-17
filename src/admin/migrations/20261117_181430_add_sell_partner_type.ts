import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_forms_property_partners_partner_type" ADD VALUE 'sell';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_property_partners" ALTER COLUMN "partner_type" SET DATA TYPE text;
  ALTER TABLE "forms_property_partners" ALTER COLUMN "partner_type" SET DEFAULT 'property'::text;
  DROP TYPE "public"."enum_forms_property_partners_partner_type";
  CREATE TYPE "public"."enum_forms_property_partners_partner_type" AS ENUM('property', 'housing');
  ALTER TABLE "forms_property_partners" ALTER COLUMN "partner_type" SET DEFAULT 'property'::"public"."enum_forms_property_partners_partner_type";
  ALTER TABLE "forms_property_partners" ALTER COLUMN "partner_type" SET DATA TYPE "public"."enum_forms_property_partners_partner_type" USING "partner_type"::"public"."enum_forms_property_partners_partner_type";`)
}
