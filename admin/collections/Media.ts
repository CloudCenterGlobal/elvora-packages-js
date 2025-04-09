import type { CollectionConfig, UploadConfig } from "payload";

const getMediaDir = (slug: string) => `public/media/${slug}`;

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

const ProfileImages: CollectionConfig = createMediaCollection({
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
    update: () => true,
  },

  fields: [],
});

const MediaCollectionConfig = [ProfileImages];

export { createMediaCollection, getMediaDir, MediaCollectionConfig, ProfileImages };
