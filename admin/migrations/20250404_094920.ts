import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_forms" ALTER COLUMN "form" SET DEFAULT '{"fields":[]}'::jsonb;
  ALTER TABLE "job_postings" ADD COLUMN "job_questions_id" integer;
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_job_questions_id_job_forms_id_fk" FOREIGN KEY ("job_questions_id") REFERENCES "public"."job_forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "job_postings_job_questions_idx" ON "job_postings" USING btree ("job_questions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_job_questions_id_job_forms_id_fk";
  
  DROP INDEX IF EXISTS "job_postings_job_questions_idx";
  ALTER TABLE "job_forms" ALTER COLUMN "form" DROP DEFAULT;
  ALTER TABLE "job_postings" DROP COLUMN IF EXISTS "job_questions_id";`)
}
