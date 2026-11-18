import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"zoho_client_id" varchar,
  	"zoho_client_secret" varchar,
  	"zoho_accounts_url" varchar DEFAULT 'https://accounts.zoho.eu',
  	"zoho_api_url" varchar DEFAULT 'https://www.zohoapis.eu',
  	"zoho_member_status" varchar,
  	"zoho_dry_run" boolean DEFAULT false,
  	"zoho_expires_at" timestamp(3) with time zone,
  	"zoho_refresh_token" varchar,
  	"zoho_connected_at" timestamp(3) with time zone,
  	"zoho_connected_by" varchar,
  	"privyr_webhook_url" varchar,
  	"privyr_expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "settings" CASCADE;`)
}
