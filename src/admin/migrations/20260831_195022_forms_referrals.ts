import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "forms_referrals_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "forms_referrals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"referred_name" varchar NOT NULL,
  	"referred_age" numeric,
  	"additional_info" varchar,
  	"referrer_name" varchar NOT NULL,
  	"organisation" varchar,
  	"role" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_referrals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"forms_referral_documents_id" integer
  );
  
  CREATE TABLE "forms_referral_documents" (
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_referrals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_referral_documents_id" integer;
  ALTER TABLE "forms_referrals_texts" ADD CONSTRAINT "forms_referrals_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms_referrals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_referrals_rels" ADD CONSTRAINT "forms_referrals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms_referrals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_referrals_rels" ADD CONSTRAINT "forms_referrals_rels_forms_referral_documents_fk" FOREIGN KEY ("forms_referral_documents_id") REFERENCES "public"."forms_referral_documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_referrals_texts_order_parent" ON "forms_referrals_texts" USING btree ("order","parent_id");
  CREATE INDEX "forms_referrals_updated_at_idx" ON "forms_referrals" USING btree ("updated_at");
  CREATE INDEX "forms_referrals_created_at_idx" ON "forms_referrals" USING btree ("created_at");
  CREATE INDEX "forms_referrals_rels_order_idx" ON "forms_referrals_rels" USING btree ("order");
  CREATE INDEX "forms_referrals_rels_parent_idx" ON "forms_referrals_rels" USING btree ("parent_id");
  CREATE INDEX "forms_referrals_rels_path_idx" ON "forms_referrals_rels" USING btree ("path");
  CREATE INDEX "forms_referrals_rels_forms_referral_documents_id_idx" ON "forms_referrals_rels" USING btree ("forms_referral_documents_id");
  CREATE INDEX "forms_referral_documents_updated_at_idx" ON "forms_referral_documents" USING btree ("updated_at");
  CREATE INDEX "forms_referral_documents_created_at_idx" ON "forms_referral_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_referral_documents_filename_idx" ON "forms_referral_documents" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_referrals_fk" FOREIGN KEY ("forms_referrals_id") REFERENCES "public"."forms_referrals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_referral_documents_fk" FOREIGN KEY ("forms_referral_documents_id") REFERENCES "public"."forms_referral_documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_forms_referrals_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_referrals_id");
  CREATE INDEX "payload_locked_documents_rels_forms_referral_documents_i_idx" ON "payload_locked_documents_rels" USING btree ("forms_referral_documents_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_referrals_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_referrals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_referrals_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_referral_documents" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_referrals_texts" CASCADE;
  DROP TABLE "forms_referrals" CASCADE;
  DROP TABLE "forms_referrals_rels" CASCADE;
  DROP TABLE "forms_referral_documents" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_referrals_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_referral_documents_id";`)
}
