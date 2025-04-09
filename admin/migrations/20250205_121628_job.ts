import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "job_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"form" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX IF EXISTS "blog_images_sizes_thumbnail_sizes_thumbnail_filename_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_forms_id" integer;
  CREATE INDEX IF NOT EXISTS "job_forms_updated_at_idx" ON "job_forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "job_forms_created_at_idx" ON "job_forms" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_forms_fk" FOREIGN KEY ("job_forms_id") REFERENCES "public"."job_forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_job_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("job_forms_id");
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_url";
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_width";
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_height";
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type";
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_filesize";
  ALTER TABLE "blog_images" DROP COLUMN IF EXISTS "sizes_thumbnail_filename";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_forms" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "job_forms" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_forms_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_job_forms_id_idx";
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "blog_images" ADD COLUMN "sizes_thumbnail_filename" varchar;
  CREATE INDEX IF NOT EXISTS "blog_images_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "blog_images" USING btree ("sizes_thumbnail_filename");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "job_forms_id";`)
}
