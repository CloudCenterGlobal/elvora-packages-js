import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_images" ADD COLUMN "blur_data_u_r_l" varchar;
  ALTER TABLE "blog_images" ADD COLUMN "file_hash" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_images" DROP COLUMN "blur_data_u_r_l";
  ALTER TABLE "blog_images" DROP COLUMN "file_hash";`)
}
