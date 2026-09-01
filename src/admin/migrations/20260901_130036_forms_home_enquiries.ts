import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_home_enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_name" varchar NOT NULL,
  	"home_slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_home_enquiries_id" integer;
  CREATE INDEX "forms_home_enquiries_updated_at_idx" ON "forms_home_enquiries" USING btree ("updated_at");
  CREATE INDEX "forms_home_enquiries_created_at_idx" ON "forms_home_enquiries" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_home_enquiries_fk" FOREIGN KEY ("forms_home_enquiries_id") REFERENCES "public"."forms_home_enquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_forms_home_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_home_enquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_home_enquiries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_home_enquiries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_home_enquiries_id";`)
}
