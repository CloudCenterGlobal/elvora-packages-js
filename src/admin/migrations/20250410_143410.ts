import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "permissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "permissions_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_system" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "permissions_groups_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"permissions_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "permission_group_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"group_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "permissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "permissions_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "permission_group_users_id" integer;
  DO $$ BEGIN
   ALTER TABLE "permissions_groups_rels" ADD CONSTRAINT "permissions_groups_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."permissions_groups"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "permissions_groups_rels" ADD CONSTRAINT "permissions_groups_rels_permissions_fk" FOREIGN KEY ("permissions_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "permission_group_users" ADD CONSTRAINT "permission_group_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "permission_group_users" ADD CONSTRAINT "permission_group_users_group_id_permissions_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."permissions_groups"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "permissions_key_idx" ON "permissions" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "permissions_updated_at_idx" ON "permissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "permissions_created_at_idx" ON "permissions" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "permissions_groups_name_idx" ON "permissions_groups" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "permissions_groups_updated_at_idx" ON "permissions_groups" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "permissions_groups_created_at_idx" ON "permissions_groups" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "permissions_groups_rels_order_idx" ON "permissions_groups_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "permissions_groups_rels_parent_idx" ON "permissions_groups_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "permissions_groups_rels_path_idx" ON "permissions_groups_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "permissions_groups_rels_permissions_id_idx" ON "permissions_groups_rels" USING btree ("permissions_id");
  CREATE INDEX IF NOT EXISTS "permission_group_users_user_idx" ON "permission_group_users" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "permission_group_users_group_idx" ON "permission_group_users" USING btree ("group_id");
  CREATE INDEX IF NOT EXISTS "permission_group_users_updated_at_idx" ON "permission_group_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "permission_group_users_created_at_idx" ON "permission_group_users" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_permissions_fk" FOREIGN KEY ("permissions_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_permissions_groups_fk" FOREIGN KEY ("permissions_groups_id") REFERENCES "public"."permissions_groups"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_permission_group_users_fk" FOREIGN KEY ("permission_group_users_id") REFERENCES "public"."permission_group_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_permissions_id_idx" ON "payload_locked_documents_rels" USING btree ("permissions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_permissions_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("permissions_groups_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_permission_group_users_id_idx" ON "payload_locked_documents_rels" USING btree ("permission_group_users_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "permissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "permissions_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "permissions_groups_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "permission_group_users" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "permissions" CASCADE;
  DROP TABLE "permissions_groups" CASCADE;
  DROP TABLE "permissions_groups_rels" CASCADE;
  DROP TABLE "permission_group_users" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_permissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_permissions_groups_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_permission_group_users_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_permissions_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_permissions_groups_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_permission_group_users_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "permissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "permissions_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "permission_group_users_id";`);
}
