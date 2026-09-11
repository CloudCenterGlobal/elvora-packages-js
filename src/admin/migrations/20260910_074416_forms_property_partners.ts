import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_property_partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"property_location" varchar,
  	"additional_info" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_property_partners_id" integer;
  CREATE INDEX "forms_property_partners_updated_at_idx" ON "forms_property_partners" USING btree ("updated_at");
  CREATE INDEX "forms_property_partners_created_at_idx" ON "forms_property_partners" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_property_partners_fk" FOREIGN KEY ("forms_property_partners_id") REFERENCES "public"."forms_property_partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_forms_property_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_property_partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_property_partners" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_property_partners" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_property_partners_fk";
  
  DROP INDEX "payload_locked_documents_rels_forms_property_partners_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_property_partners_id";`)
}
