import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_forms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_forms_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "_job_forms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_form" jsonb DEFAULT '{"fields":[]}'::jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_forms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "job_forms" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "job_forms" ALTER COLUMN "form" DROP NOT NULL;
  ALTER TABLE "job_forms" ADD COLUMN "_status" "enum_job_forms_status" DEFAULT 'draft';
  DO $$ BEGIN
   ALTER TABLE "_job_forms_v" ADD CONSTRAINT "_job_forms_v_parent_id_job_forms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "_job_forms_v_parent_idx" ON "_job_forms_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version_updated_at_idx" ON "_job_forms_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version_created_at_idx" ON "_job_forms_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version__status_idx" ON "_job_forms_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_created_at_idx" ON "_job_forms_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_updated_at_idx" ON "_job_forms_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_latest_idx" ON "_job_forms_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_autosave_idx" ON "_job_forms_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "job_forms__status_idx" ON "job_forms" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_job_forms_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_job_forms_v" CASCADE;
  DROP INDEX IF EXISTS "job_forms__status_idx";
  ALTER TABLE "job_forms" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "job_forms" ALTER COLUMN "form" SET NOT NULL;
  ALTER TABLE "job_forms" DROP COLUMN IF EXISTS "_status";
  DROP TYPE "public"."enum_job_forms_status";
  DROP TYPE "public"."enum__job_forms_v_version_status";`)
}
