import fs from "fs/promises";
import path from "path";
import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import type { CollectionAfterChangeHook, CollectionConfig, UploadConfig } from "payload";

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

export { createFileReplacedCleanupHook, createMediaCollection, getMediaDir, MediaCollectionConfig, ProfileImages };
