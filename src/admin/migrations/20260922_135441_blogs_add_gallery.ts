import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blogs_rels" ADD COLUMN "blog_images_id" integer;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_blog_images_fk" FOREIGN KEY ("blog_images_id") REFERENCES "public"."blog_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blogs_rels_blog_images_id_idx" ON "blogs_rels" USING btree ("blog_images_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blogs_rels" DROP CONSTRAINT "blogs_rels_blog_images_fk";
  
  DROP INDEX "blogs_rels_blog_images_id_idx";
  ALTER TABLE "blogs_rels" DROP COLUMN "blog_images_id";`)
}
