import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import {
  BlockquoteFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  lexicalEditor,
  OrderedListFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
} from "@payloadcms/richtext-lexical";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeValidateHook } from "payload";
import slugify from "slugify";

const idOf = (value: unknown): number | string | undefined => {
  if (value === null || value === undefined) return undefined;
  return typeof value === "object" ? (value as { id: number | string }).id : (value as number | string);
};

/**
 * Deletes a `blog-images` doc (and, via its own hooks, the file on
 * disk) — but only if no other blog post still references it. A blog's
 * thumbnail is normally 1:1 with its image, but the admin's "Choose
 * from existing" picker lets an editor point two posts at the same
 * upload, so this checks before removing anything out from under a
 * post that still needs it.
 */
async function deleteThumbnailIfOrphaned({
  req,
  thumbnailId,
  excludeBlogId,
}: {
  req: Parameters<CollectionAfterChangeHook>[0]["req"];
  thumbnailId: number | string;
  excludeBlogId: number | string;
}) {
  try {
    const stillReferenced = await req.payload.find({
      collection: "blogs",
      where: {
        and: [{ thumbnail: { equals: thumbnailId } }, { id: { not_equals: excludeBlogId } }],
      },
      limit: 1,
      depth: 0,
      req,
    });

    if (stillReferenced.docs.length > 0) return;

    await req.payload.delete({ collection: "blog-images", id: thumbnailId, req });
  } catch (error) {
    // Cleanup failing shouldn't fail the blog save/delete itself — just
    // leaves an orphaned image behind for manual cleanup.
    req.payload.logger.error({ err: error, thumbnailId }, "Failed to delete orphaned blog thumbnail");
  }
}

/**
 * Mirrors the brand palette in the main app's `src/theme/palette.ts`
 * (CORAL/CORAL_DARK/PLUM/PLUM_DEEP) — hardcoded rather than imported
 * from there, since this package is meant to stay usable outside this
 * one app. Keep in sync by hand if the brand palette changes.
 */
const THEME_TEXT_COLORS = {
  coral: { label: "Coral", css: { color: "#FF4646" } },
  "coral-dark": { label: "Coral (dark)", css: { color: "#CC2F2F" } },
  plum: { label: "Plum", css: { color: "#64405F" } },
  "plum-dark": { label: "Plum (dark)", css: { color: "#3B2340" } },
};

const beforeValidate: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (data) {
    data.slug = slugify(data.title ?? "", {
      lower: true,
    });
  }

  return data;
};

// Thumbnail swapped for a different upload on an update — the old one
// is no longer reachable from anywhere in the admin once this save
// completes, so clean it up rather than leaving it to accumulate.
const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== "update") return doc;

  const oldThumbnailId = idOf(previousDoc?.thumbnail);
  const newThumbnailId = idOf(doc?.thumbnail);
  if (!oldThumbnailId || oldThumbnailId === newThumbnailId) return doc;

  await deleteThumbnailIfOrphaned({ req, thumbnailId: oldThumbnailId, excludeBlogId: doc.id });

  return doc;
};

// Blog post deleted outright — its thumbnail goes with it.
const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const thumbnailId = idOf(doc?.thumbnail);
  if (!thumbnailId) return doc;

  await deleteThumbnailIfOrphaned({ req, thumbnailId, excludeBlogId: doc.id });

  return doc;
};

const Blogs = createCollection({
  slug: "blogs",
  admin: {
    useAsTitle: "title",
    description: "Manage blog posts",
    enableRichTextRelationship: true,
    defaultColumns: ["title", "thumbnail", "author", "published", "createdAt", "categories"],
  },

  hooks: {
    beforeValidate: [beforeValidate],
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },

  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: false,
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "This will be automatically generated from the title once the blog post is saved.",
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
      // Extends the root editor (Bold/Italic/Link/Align/Indent/Heading/
      // Paragraph/UnorderedList) with the rest of standard formatting,
      // plus a text-colour picker restricted to the brand palette
      // instead of a free-form colour wheel.
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          UnderlineFeature(),
          StrikethroughFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          InlineCodeFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          TextStateFeature({ state: { color: THEME_TEXT_COLORS } }),
        ],
      }),
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "upload",
      relationTo: "blog-images",
      required: true,
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        description: "Author of the blog post. This will be displayed on the blog post.",
        position: "sidebar",
      },
    },
    {
      name: "categories",
      label: "Categories",
      type: "relationship",
      relationTo: "blog-categories",
      required: true,
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Categories of the blog post. Recommended to add at least one category.",
      },
    },
    {
      name: "tags",
      label: "Tags",
      type: "relationship",
      relationTo: "blog-tags",
      required: true,
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "published",
      label: "Publish",
      type: "checkbox",
      defaultValue: true,
      required: false,
      admin: {
        position: "sidebar",
        description: "Check this box to publish the blog post.",
      },
    },
  ],
});

export default Blogs;
