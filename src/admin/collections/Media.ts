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

// sha256 of the last file createBlurDataURLHook generated a placeholder
// from, so a re-save with unchanged bytes can skip redoing the render.
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

// Generates the next/image placeholder="blur" data from the just-processed
// file. Skips it when the file didn't change, isn't a raster image, or its
// hash matches what's already stored.
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

// Payload doesn't clean up a file it replaces on update (only on delete),
// so wire this into afterChange to unlink the old file + sizes.
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
