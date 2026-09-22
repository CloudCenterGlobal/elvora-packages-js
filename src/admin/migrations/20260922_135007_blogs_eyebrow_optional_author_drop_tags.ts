import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_tags" DISABLE ROW LEVEL SECURITY;
  -- \`DROP TABLE ... CASCADE\` already drops the FK constraints on
  -- blogs_rels/payload_locked_documents_rels that reference this table
  -- (payload's migration generator emits explicit DROP CONSTRAINT
  -- statements for them too, which then fail with "constraint does not
  -- exist" since CASCADE got there first) — dropped here.
  DROP TABLE "blog_tags" CASCADE;
  DROP INDEX "blogs_rels_blog_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_tags_id_idx";
  ALTER TABLE "blogs" ALTER COLUMN "author_id" DROP NOT NULL;
  ALTER TABLE "blogs" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "blogs_rels" DROP COLUMN "blog_tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_tags_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "blog_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "blogs" ALTER COLUMN "author_id" SET NOT NULL;
  ALTER TABLE "blogs_rels" ADD COLUMN "blog_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_tags_id" integer;
  CREATE UNIQUE INDEX "blog_tags_name_idx" ON "blog_tags" USING btree ("name");
  CREATE INDEX "blog_tags_updated_at_idx" ON "blog_tags" USING btree ("updated_at");
  CREATE INDEX "blog_tags_created_at_idx" ON "blog_tags" USING btree ("created_at");
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blogs_rels_blog_tags_id_idx" ON "blogs_rels" USING btree ("blog_tags_id");
  CREATE INDEX "payload_locked_documents_rels_blog_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_tags_id");
  ALTER TABLE "blogs" DROP COLUMN "eyebrow";`)
}
