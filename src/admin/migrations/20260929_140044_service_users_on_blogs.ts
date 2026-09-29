import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "service_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "blogs" ADD COLUMN "service_user_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_users_id" integer;
  CREATE UNIQUE INDEX "service_users_name_idx" ON "service_users" USING btree ("name");
  CREATE UNIQUE INDEX "service_users_slug_idx" ON "service_users" USING btree ("slug");
  CREATE INDEX "service_users_updated_at_idx" ON "service_users" USING btree ("updated_at");
  CREATE INDEX "service_users_created_at_idx" ON "service_users" USING btree ("created_at");
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_service_user_id_service_users_id_fk" FOREIGN KEY ("service_user_id") REFERENCES "public"."service_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_users_fk" FOREIGN KEY ("service_users_id") REFERENCES "public"."service_users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blogs_service_user_idx" ON "blogs" USING btree ("service_user_id");
  CREATE INDEX "payload_locked_documents_rels_service_users_id_idx" ON "payload_locked_documents_rels" USING btree ("service_users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_users" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_users" CASCADE;
  ALTER TABLE "blogs" DROP CONSTRAINT "blogs_service_user_id_service_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_users_fk";
  
  DROP INDEX "blogs_service_user_idx";
  DROP INDEX "payload_locked_documents_rels_service_users_id_idx";
  ALTER TABLE "blogs" DROP COLUMN "service_user_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_users_id";`)
}
