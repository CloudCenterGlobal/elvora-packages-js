import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_postings" RENAME COLUMN "metadata_job_questions_id" TO "job_questions_id";
  ALTER TABLE "job_postings" RENAME COLUMN "metadata_created_by_id" TO "created_by_id";
  ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_metadata_job_questions_id_job_forms_id_fk";
  
  ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_metadata_created_by_id_users_id_fk";
  
  DROP INDEX IF EXISTS "job_postings_metadata_metadata_job_questions_idx";
  DROP INDEX IF EXISTS "job_postings_metadata_metadata_created_by_idx";
  ALTER TABLE "job_postings" ADD COLUMN "metadata_weekly_hours" numeric;
  ALTER TABLE "job_postings" ADD COLUMN "metadata_reason_for_hiring" varchar;
  ALTER TABLE "job_postings" ADD COLUMN "published_by_id" integer;
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_job_questions_id_job_forms_id_fk" FOREIGN KEY ("job_questions_id") REFERENCES "public"."job_forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "job_postings_job_questions_idx" ON "job_postings" USING btree ("job_questions_id");
  CREATE INDEX IF NOT EXISTS "job_postings_created_by_idx" ON "job_postings" USING btree ("created_by_id");
  CREATE INDEX IF NOT EXISTS "job_postings_published_by_idx" ON "job_postings" USING btree ("published_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_postings" RENAME COLUMN "job_questions_id" TO "metadata_job_questions_id";
  ALTER TABLE "job_postings" RENAME COLUMN "created_by_id" TO "metadata_created_by_id";
  ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_job_questions_id_job_forms_id_fk";
  
  ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_created_by_id_users_id_fk";
  
  ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_published_by_id_users_id_fk";
  
  DROP INDEX IF EXISTS "job_postings_job_questions_idx";
  DROP INDEX IF EXISTS "job_postings_created_by_idx";
  DROP INDEX IF EXISTS "job_postings_published_by_idx";
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_metadata_job_questions_id_job_forms_id_fk" FOREIGN KEY ("metadata_job_questions_id") REFERENCES "public"."job_forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_metadata_created_by_id_users_id_fk" FOREIGN KEY ("metadata_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_metadata_job_questions_idx" ON "job_postings" USING btree ("metadata_job_questions_id");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_metadata_created_by_idx" ON "job_postings" USING btree ("metadata_created_by_id");
  ALTER TABLE "job_postings" DROP COLUMN IF EXISTS "metadata_weekly_hours";
  ALTER TABLE "job_postings" DROP COLUMN IF EXISTS "metadata_reason_for_hiring";
  ALTER TABLE "job_postings" DROP COLUMN IF EXISTS "published_by_id";`)
}
