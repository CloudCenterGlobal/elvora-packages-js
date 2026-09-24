import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook } from "payload";
import { createFileReplacedCleanupHook, createMediaCollection, getMediaDir } from "../Media";

const STATIC_DIR = getMediaDir("blog-images");

// A focal point or crop edit here doesn't touch the referencing blog
// post's own doc, so `Blogs`' afterChange hook never fires for it -
// without this the story pages stay on stale ISR output for up to 5
// minutes after the edit. See the same call in `Blogs.ts` for why
// `"layout"` (bust everything under the path) instead of a specific
// story slug: which post(s) use this image isn't known here.
const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
  revalidatePath("/about/our-stories", "layout");
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
    ],
  })
);

export default BlogImages;
