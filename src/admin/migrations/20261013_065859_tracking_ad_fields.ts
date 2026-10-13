import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_utm_medium" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_utm_term" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_campaign_id" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_adset_id" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_ad_id" varchar;
  ALTER TABLE "forms_property_partners" ADD COLUMN "tracking_placement" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_utm_medium";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_utm_term";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_campaign_id";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_adset_id";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_ad_id";
  ALTER TABLE "forms_property_partners" DROP COLUMN "tracking_placement";`)
}
