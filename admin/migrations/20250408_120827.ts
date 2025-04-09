import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_applications" ALTER COLUMN "assessment" SET DEFAULT '{"answers":{},"fields":[]}'::jsonb;
  ALTER TABLE "job_applications" ADD COLUMN "uuid" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "job_applications_uuid_idx" ON "job_applications" USING btree ("uuid");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "job_applications_uuid_idx";
  ALTER TABLE "job_applications" ALTER COLUMN "assessment" SET DEFAULT '{"answers":{},"fields":[],"uuid":""}'::jsonb;
  ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "uuid";`)
}
