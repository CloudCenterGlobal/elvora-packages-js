import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_callbacks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"contact_method" varchar NOT NULL,
  	"preferred_datetime" timestamp(3) with time zone,
  	"additional_info" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_callbacks_id" integer;
  CREATE INDEX "forms_callbacks_updated_at_idx" ON "forms_callbacks" USING btree ("updated_at");
  CREATE INDEX "forms_callbacks_created_at_idx" ON "forms_callbacks" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_callbacks_fk" FOREIGN KEY ("forms_callbacks_id") REFERENCES "public"."forms_callbacks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_forms_callbacks_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_callbacks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_callbacks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_callbacks" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_callbacks_id";`)
}
