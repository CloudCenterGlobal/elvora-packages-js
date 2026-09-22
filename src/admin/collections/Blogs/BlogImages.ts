import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { createMediaCollection, getMediaDir } from "../Media";

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
    upload: {
      crop: true,
      staticDir: getMediaDir("blog-images"),
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
