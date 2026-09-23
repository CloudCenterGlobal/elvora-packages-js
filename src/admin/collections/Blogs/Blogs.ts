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
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeValidateHook } from "payload";
import slugify from "slugify";

const idOf = (value: unknown): number | string | undefined => {
  if (value === null || value === undefined) return undefined;
  return typeof value === "object" ? (value as { id: number | string }).id : (value as number | string);
};

const idsOf = (value: unknown): (number | string)[] => {
  if (!Array.isArray(value)) return [];
  return value.map(idOf).filter((id): id is number | string => id !== undefined);
};

// Walks a Lexical `content` tree (the raw, unpopulated JSON as stored —
// an `upload` node's `value` is just the `blog-images` id, not the
// populated doc) looking for inline-image nodes added via the content
// field's `UploadFeature`, and returns the ids they reference.
function collectInlineImageIds(content: unknown): (number | string)[] {
  const ids: (number | string)[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const record = node as Record<string, unknown>;

    if (record.type === "upload" && record.relationTo === "blog-images") {
      const id = idOf(record.value);
      if (id !== undefined) ids.push(id);
    }

    if (Array.isArray(record.children)) {
      for (const child of record.children) visit(child);
    }
    if ("root" in record) visit(record.root);
  };

  visit(content);
  return ids;
}

/**
 * Deletes a `blog-images` doc (and, via its own hooks, the file on
 * disk) — but only if no blog post still references it, as a
 * thumbnail, a gallery item, or an inline image embedded in the body.
 * Checked against current DB state (this always runs after the
 * triggering write has committed), so no "exclude this blog"
 * special-casing is needed: if the same post still points at this
 * image from another field/placement, that still shows up here and
 * blocks the delete correctly.
 *
 * Inline references live inside the `content` JSON blob, which can't
 * be matched with a `where` filter — this fetches every blog's
 * thumbnail/gallery/content and checks in JS instead. Fine at the
 * scale of a blog collection; revisit if that ever changes.
 */
async function deleteImageIfOrphaned({
  req,
  imageId,
}: {
  req: Parameters<CollectionAfterChangeHook>[0]["req"];
  imageId: number | string;
}) {
  try {
    const { docs } = await req.payload.find({
      collection: "blogs",
      limit: 0,
      pagination: false,
      depth: 0,
      select: { thumbnail: true, gallery: true, content: true },
      req,
    });

    const stillReferenced = docs.some(
      (doc) =>
        idOf(doc.thumbnail) === imageId ||
        idsOf(doc.gallery).includes(imageId) ||
        collectInlineImageIds(doc.content).includes(imageId)
    );

    if (stillReferenced) return;

    await req.payload.delete({ collection: "blog-images", id: imageId, req });
  } catch (error) {
    // Cleanup failing shouldn't fail the blog save/delete itself — just
    // leaves an orphaned image behind for manual cleanup.
    req.payload.logger.error({ err: error, imageId }, "Failed to delete orphaned blog image");
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

// Derives the slug from the title only when the field's empty — an
// editor's own value (typed directly, or a previous auto-generated one
// they've since edited) is left as the source instead of being
// silently overwritten on every save. Either way, whatever ends up in
// `data.slug` (title-derived or hand-typed) is run through `slugify`,
// so a manually entered value can't sneak spaces, punctuation, or
// other characters past the "Auto-generated ... this must be unique"
// URL-safe slug the rest of the field's own validation assumes.
const beforeValidate: CollectionBeforeValidateHook = async ({ data }) => {
  if (data) {
    data.slug = slugify(data.slug || data.title || "", { lower: true, strict: true });
  }

  return data;
};

// Thumbnail swapped, or an image dropped from the gallery, on an
// update — anything no longer referenced by this doc's new state is
// cleaned up rather than left to accumulate.
const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== "update") return doc;

  const oldThumbnailId = idOf(previousDoc?.thumbnail);
  const newThumbnailId = idOf(doc?.thumbnail);
  const removedThumbnailId = oldThumbnailId && oldThumbnailId !== newThumbnailId ? oldThumbnailId : undefined;

  const oldGalleryIds = idsOf(previousDoc?.gallery);
  const newGalleryIds = new Set(idsOf(doc?.gallery));
  const removedGalleryIds = oldGalleryIds.filter((id) => !newGalleryIds.has(id));

  const oldInlineIds = collectInlineImageIds(previousDoc?.content);
  const newInlineIds = new Set(collectInlineImageIds(doc?.content));
  const removedInlineIds = oldInlineIds.filter((id) => !newInlineIds.has(id));

  const candidateIds = new Set([
    ...(removedThumbnailId ? [removedThumbnailId] : []),
    ...removedGalleryIds,
    ...removedInlineIds,
  ]);
  for (const imageId of candidateIds) {
    await deleteImageIfOrphaned({ req, imageId });
  }

  return doc;
};

// Blog post deleted outright — its thumbnail, gallery, and any inline
// body images go with it.
const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const imageIds = new Set([
    ...(idOf(doc?.thumbnail) ? [idOf(doc.thumbnail)!] : []),
    ...idsOf(doc?.gallery),
    ...collectInlineImageIds(doc?.content),
  ]);

  for (const imageId of imageIds) {
    await deleteImageIfOrphaned({ req, imageId });
  }

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
        description: "Auto-generated from the title if left blank. Edit it directly to override.",
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
          // Lets an editor drop an image from `blog-images` into the
          // middle of the body text, with its own optional caption —
          // separate from (and in addition to) the thumbnail/gallery
          // upload fields below.
          UploadFeature({
            collections: {
              "blog-images": {
                fields: [
                  {
                    name: "caption",
                    label: "Caption",
                    type: "text",
                    admin: {
                      description: "Optional — shown beneath the image.",
                    },
                  },
                ],
              },
            },
          }),
        ],
      }),
    },
    {
      name: "eyebrow",
      label: "Eyebrow / Tagline",
      type: "text",
      required: false,
      admin: {
        position: "sidebar",
        description: 'Short label shown above the title (e.g. "My Story", "Publication"). Defaults to the first category\'s name if left blank.',
      },
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "upload",
      relationTo: "blog-images",
      required: true,
    },
    {
      name: "gallery",
      label: "Gallery",
      type: "upload",
      relationTo: "blog-images",
      hasMany: true,
      required: false,
      admin: {
        description: "Optional additional images, shown as a gallery on the blog post below the body.",
      },
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      required: false,
      hasMany: false,
      admin: {
        description: "Optional — not currently shown on the blog post itself.",
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
