import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blogs_id" integer
  );
  
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_settings_rels_order_idx" ON "homepage_settings_rels" USING btree ("order");
  CREATE INDEX "homepage_settings_rels_parent_idx" ON "homepage_settings_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_settings_rels_path_idx" ON "homepage_settings_rels" USING btree ("path");
  CREATE INDEX "homepage_settings_rels_blogs_id_idx" ON "homepage_settings_rels" USING btree ("blogs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_settings" CASCADE;
  DROP TABLE "homepage_settings_rels" CASCADE;`)
}
