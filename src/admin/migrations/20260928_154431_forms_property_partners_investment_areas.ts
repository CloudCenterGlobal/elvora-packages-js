import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_property_partners_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "forms_property_partners_texts" ADD CONSTRAINT "forms_property_partners_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms_property_partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_property_partners_texts_order_parent" ON "forms_property_partners_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_property_partners_texts" CASCADE;`)
}
