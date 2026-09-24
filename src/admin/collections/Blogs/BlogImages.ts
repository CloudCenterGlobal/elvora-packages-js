import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { CollectionAfterChangeHook } from "payload";
import {
  BLUR_DATA_URL_FIELD,
  createBlurDataURLHook,
  createFileReplacedCleanupHook,
  createMediaCollection,
  FILE_HASH_FIELD,
  getMediaDir,
} from "../Media";
import { revalidateStories } from "./revalidateStories";

const STATIC_DIR = getMediaDir("blog-images");

const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
  revalidateStories();
  return doc;
};

const BlogImages = createCollection(
  createMediaCollection({
    slug: "blog-images",
    // Blog thumbnails render on the public marketing site — the file
    // itself is fetched directly by the browser (via Next's image
    // optimizer hitting `/api/blog-images/file/...`), not through the
    // Local API the site's pages use to read post data, so it needs its
    // own public `read` override rather than the permission-gated
    // default every other operation on this collection keeps.
    access: {
      read: () => true,
    },
    hooks: {
      beforeChange: [createBlurDataURLHook()],
      afterChange: [afterChange, createFileReplacedCleanupHook(STATIC_DIR)],
    },
    upload: {
      crop: true,
      staticDir: STATIC_DIR,
      bulkUpload: false,
      resizeOptions: {
        background: {
          r: 255,
          g: 255,
          b: 255,
          alpha: 0,
        },
      },
    },

    fields: [
      {
        name: "filename",
        type: "text",
        hooks: {},
      },
      BLUR_DATA_URL_FIELD,
      FILE_HASH_FIELD,
    ],
  })
);

export default BlogImages;
