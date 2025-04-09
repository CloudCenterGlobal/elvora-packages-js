import { createMediaCollection, getMediaDir } from "collections/Media";
import { CollectionConfig } from "payload";

const BlogImages: CollectionConfig = createMediaCollection({
  slug: "blog-images",
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
});

export default BlogImages;
