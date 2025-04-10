import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_postings_metadata_job_types" AS ENUM('full-time', 'part-time', 'contract', 'temporary', 'internship');
  CREATE TYPE "public"."enum_job_postings_role" AS ENUM('Mental Health Support Worker', 'Children Support Worker', 'Support Worker', 'Senior Support Worker', 'Care Assistant', 'Senior Care Assistant', 'Registered Care Manager', 'Care Manager', 'Registered Nurse', 'Registered Mental Health Nurse');
  CREATE TYPE "public"."enum_job_postings_metadata_recruitment_type" AS ENUM('Internal', 'External');
  CREATE TYPE "public"."enum_job_postings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_job_forms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_forms_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"bio" varchar,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "profile_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"content" jsonb NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blogs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"blog_tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "blog_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "job_postings_metadata_job_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_job_postings_metadata_job_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "job_postings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_job_postings_role" NOT NULL,
  	"metadata_recruitment_type" "enum_job_postings_metadata_recruitment_type" DEFAULT 'Internal' NOT NULL,
  	"metadata_min_pay" numeric,
  	"metadata_max_pay" numeric,
  	"metadata_job_location_id" integer NOT NULL,
  	"metadata_job_questions_id" integer,
  	"metadata_created_by_id" integer,
  	"details_description" jsonb NOT NULL,
  	"details_short_description" varchar,
  	"uuid" varchar,
  	"status" "enum_job_postings_status" DEFAULT 'draft',
  	"start_date" timestamp(3) with time zone,
  	"job_expiration" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "job_locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"location" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "job_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"form" jsonb DEFAULT '{"fields":[]}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_forms_status" DEFAULT 'draft'
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"mobile" varchar,
  	"cv" varchar NOT NULL,
  	"job_id" integer NOT NULL,
  	"assessment" jsonb DEFAULT '{"answers":{},"fields":[]}'::jsonb,
  	"uuid" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"profile_images_id" integer,
  	"blogs_id" integer,
  	"blog_categories_id" integer,
  	"blog_images_id" integer,
  	"blog_tags_id" integer,
  	"job_postings_id" integer,
  	"job_locations_id" integer,
  	"job_forms_id" integer,
  	"job_applications_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_profile_images_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."profile_images"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blogs" ADD CONSTRAINT "blogs_thumbnail_id_blog_images_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."blog_images"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_postings_metadata_job_types" ADD CONSTRAINT "job_postings_metadata_job_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_metadata_job_location_id_job_locations_id_fk" FOREIGN KEY ("metadata_job_location_id") REFERENCES "public"."job_locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "_job_forms_v" ADD CONSTRAINT "_job_forms_v_parent_id_job_forms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_job_postings_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_postings"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profile_images_fk" FOREIGN KEY ("profile_images_id") REFERENCES "public"."profile_images"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_images_fk" FOREIGN KEY ("blog_images_id") REFERENCES "public"."blog_images"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_postings_fk" FOREIGN KEY ("job_postings_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_locations_fk" FOREIGN KEY ("job_locations_id") REFERENCES "public"."job_locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_forms_fk" FOREIGN KEY ("job_forms_id") REFERENCES "public"."job_forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "profile_images_updated_at_idx" ON "profile_images" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "profile_images_created_at_idx" ON "profile_images" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "profile_images_filename_idx" ON "profile_images" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "blogs_title_idx" ON "blogs" USING btree ("title");
  CREATE UNIQUE INDEX IF NOT EXISTS "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blogs_thumbnail_idx" ON "blogs" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "blogs_author_idx" ON "blogs" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blogs_rels_order_idx" ON "blogs_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "blogs_rels_parent_idx" ON "blogs_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blogs_rels_path_idx" ON "blogs_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "blogs_rels_blog_categories_id_idx" ON "blogs_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "blogs_rels_blog_tags_id_idx" ON "blogs_rels" USING btree ("blog_tags_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_name_idx" ON "blog_categories" USING btree ("name");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_images_updated_at_idx" ON "blog_images" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_images_created_at_idx" ON "blog_images" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_images_filename_idx" ON "blog_images" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_tags_name_idx" ON "blog_tags" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "blog_tags_updated_at_idx" ON "blog_tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_tags_created_at_idx" ON "blog_tags" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_job_types_order_idx" ON "job_postings_metadata_job_types" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_job_types_parent_idx" ON "job_postings_metadata_job_types" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_metadata_job_location_idx" ON "job_postings" USING btree ("metadata_job_location_id");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_metadata_job_questions_idx" ON "job_postings" USING btree ("metadata_job_questions_id");
  CREATE INDEX IF NOT EXISTS "job_postings_metadata_metadata_created_by_idx" ON "job_postings" USING btree ("metadata_created_by_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "job_postings_uuid_idx" ON "job_postings" USING btree ("uuid");
  CREATE INDEX IF NOT EXISTS "job_postings_updated_at_idx" ON "job_postings" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "job_postings_created_at_idx" ON "job_postings" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "job_locations_location_idx" ON "job_locations" USING btree ("location");
  CREATE INDEX IF NOT EXISTS "job_locations_updated_at_idx" ON "job_locations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "job_locations_created_at_idx" ON "job_locations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "job_forms_updated_at_idx" ON "job_forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "job_forms_created_at_idx" ON "job_forms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "job_forms__status_idx" ON "job_forms" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_parent_idx" ON "_job_forms_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version_updated_at_idx" ON "_job_forms_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version_created_at_idx" ON "_job_forms_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_version_version__status_idx" ON "_job_forms_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_created_at_idx" ON "_job_forms_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_updated_at_idx" ON "_job_forms_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_latest_idx" ON "_job_forms_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_job_forms_v_autosave_idx" ON "_job_forms_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "job_applications_job_idx" ON "job_applications" USING btree ("job_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "job_applications_uuid_idx" ON "job_applications" USING btree ("uuid");
  CREATE INDEX IF NOT EXISTS "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_profile_images_id_idx" ON "payload_locked_documents_rels" USING btree ("profile_images_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_images_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_images_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_job_postings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_postings_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_job_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("job_locations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_job_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("job_forms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "profile_images" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "blogs_rels" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog_images" CASCADE;
  DROP TABLE "blog_tags" CASCADE;
  DROP TABLE "job_postings_metadata_job_types" CASCADE;
  DROP TABLE "job_postings" CASCADE;
  DROP TABLE "job_locations" CASCADE;
  DROP TABLE "job_forms" CASCADE;
  DROP TABLE "_job_forms_v" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_job_postings_metadata_job_types";
  DROP TYPE "public"."enum_job_postings_role";
  DROP TYPE "public"."enum_job_postings_metadata_recruitment_type";
  DROP TYPE "public"."enum_job_postings_status";
  DROP TYPE "public"."enum_job_forms_status";
  DROP TYPE "public"."enum__job_forms_v_version_status";`)
}
