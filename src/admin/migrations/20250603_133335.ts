import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_job_postings_role" ADD VALUE 'Bank Support Worker';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public"."job_postings" ALTER COLUMN "role" SET DATA TYPE text;
  DROP TYPE "public"."enum_job_postings_role";
  CREATE TYPE "public"."enum_job_postings_role" AS ENUM('Mental Health Support Worker', 'Children Support Worker', 'Support Worker', 'Senior Support Worker', 'Care Assistant', 'Senior Care Assistant', 'Registered Care Manager', 'Care Manager', 'Registered Nurse', 'Registered Mental Health Nurse');
  ALTER TABLE "public"."job_postings" ALTER COLUMN "role" SET DATA TYPE "public"."enum_job_postings_role" USING "role"::"public"."enum_job_postings_role";`)
}
