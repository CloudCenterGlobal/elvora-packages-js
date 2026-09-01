import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_applications_status" AS ENUM('pending', 'accepted', 'rejected');
  ALTER TABLE "job_applications" ADD COLUMN "status" "enum_job_applications_status" DEFAULT 'pending' NOT NULL;
  ALTER TABLE "job_applications" ADD COLUMN "status_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_applications" DROP COLUMN "status";
  ALTER TABLE "job_applications" DROP COLUMN "status_description";
  DROP TYPE "public"."enum_job_applications_status";`)
}
