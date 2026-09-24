import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig, Field, UploadConfig } from "payload";
import sharp from "sharp";

const BLUR_PLACEHOLDER_WIDTH = 16;

const BLUR_DATA_URL_FIELD: Field = {
  name: "blurDataURL",
  type: "text",
  admin: { hidden: true },
};

// sha256 of the final (post-crop/format) file bytes `createBlurDataURLHook`
// last generated a placeholder from — lets it (and the backfill script)
// tell "the image actually changed" apart from "this doc got re-saved"
// (e.g. a focal-point-only edit re-runs the same bytes through Payload's
// upload pipeline under a new filename) without redoing the render.
const FILE_HASH_FIELD: Field = {
  name: "fileHash",
  type: "text",
  admin: { hidden: true },
};

const hashBuffer = (buffer: Buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

const generateBlurDataURL = async (source: Buffer | string) => {
  const buffer = await sharp(source).rotate().resize(BLUR_PLACEHOLDER_WIDTH).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
};

/**
 * `next/image`'s automatic `placeholder="blur"` only works for a
 * locally-imported file Next can inspect at build time — for a
 * dynamic `src` string (every image here, all served from the DB at
 * request time) it has no pixels to derive a blur from unless we hand
 * it a `blurDataURL` ourselves. Generated from `req.file` (the
 * just-processed bytes — post-crop/format, the same buffer
 * `generateFileData.js` has already assigned to `req.file` by the
 * time collection `beforeChange` hooks run) so it reflects what's
 * actually saved, not the raw upload. No-ops when this write didn't
 * touch the file (a plain field edit), it isn't a raster image, or the
 * file's content hash matches what's already stored (a crop/focal-point
 * save with no real pixel change still re-runs the file through the
 * upload pipeline under a new filename — this is what keeps that from
 * costing a redundant render on every such save).
 */
const createBlurDataURLHook = (): CollectionBeforeChangeHook => {
  return async ({ data, originalDoc, req }) => {
    const file = req.file;
    if (!file?.mimetype?.startsWith("image/") || file.mimetype === "image/svg+xml") {
      return data;
    }

    const source = file.data?.length ? file.data : file.tempFilePath;
    if (!source) return data;

    try {
      const buffer = Buffer.isBuffer(source) ? source : await fs.readFile(source);
      const hash = hashBuffer(buffer);
      if (hash === originalDoc?.fileHash) return data;

      const blurDataURL = await generateBlurDataURL(buffer);
      return { ...data, blurDataURL, fileHash: hash };
    } catch (error) {
      req.payload.logger.error({ err: error }, "Failed to generate blur placeholder");
      return data;
    }
  };
};

const getMediaDir = (slug: string) => `public/media/${slug}`;

const deleteFileIfExists = async (staticDir: string, filename?: string | null) => {
  if (!filename) return;
  try {
    await fs.unlink(path.join(staticDir, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
};

/**
 * When an upload doc's file is replaced in place (the admin's "remove
 * current file, drop a new one, save" flow on an existing document —
 * same id, new bytes) Payload never cleans up the file it replaced:
 * `deleteAssociatedFiles` (the fs.unlink call for a file + its
 * generated sizes) only runs on a whole-document delete, not an
 * update. Left alone, every in-place replace orphans the previous
 * file and its sizes on disk. Wire this into a collection's
 * `hooks.afterChange` to unlink them instead.
 */
const createFileReplacedCleanupHook = (staticDir: string): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, operation }) => {
    if (operation !== "update") return doc;
    if (!previousDoc?.filename || previousDoc.filename === doc?.filename) return doc;

    await deleteFileIfExists(staticDir, previousDoc.filename as string);

    const previousSizes = (previousDoc.sizes ?? {}) as Record<string, { filename?: string | null } | undefined>;
    for (const size of Object.values(previousSizes)) {
      await deleteFileIfExists(staticDir, size?.filename);
    }

    return doc;
  };
};

const _BaseMediaUpload: UploadConfig = {
  crop: true,
  bulkUpload: false,
  displayPreview: true,
  mimeTypes: ["image/*"],
  formatOptions: {
    format: "png",
  },
  withMetadata: false,
};

const createMediaCollection = <
  T extends Omit<CollectionConfig, "upload"> & {
    upload?: UploadConfig;
  },
>(
  config: T
): T => {
  return {
    ...config,

    upload: {
      staticURL: "/media",
      ..._BaseMediaUpload,
      ...config.upload,
    },
  };
};

const ProfileImages = createCollection(
  createMediaCollection({
    slug: "profile-images",
    upload: {
      staticDir: getMediaDir("profile-images"),
    },
    admin: {
      group: "Users",
    },
    access: {
      admin: () => true,
      create: ({ req }) => {
        return !!req.headers.get("referer")?.includes("/users/") || req.pathname.endsWith("/account");
      },
    },
    fields: [],
  })
);

const MediaCollectionConfig = [ProfileImages];

export {
  BLUR_DATA_URL_FIELD,
  createBlurDataURLHook,
  createFileReplacedCleanupHook,
  createMediaCollection,
  FILE_HASH_FIELD,
  generateBlurDataURL,
  getMediaDir,
  hashBuffer,
  MediaCollectionConfig,
  ProfileImages,
};
