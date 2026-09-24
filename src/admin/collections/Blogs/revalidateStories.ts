import { revalidatePath } from "next/cache";

/**
 * Busts the (ISR-cached, `revalidate = 300`) story listing page and
 * every `[slug]` story page beneath it in one call — used by both
 * `Blogs`' and `BlogImages`' `afterChange` hooks, since a blog-images
 * edit (a new focal point, crop, or replaced file) doesn't touch the
 * referencing blog post's own doc and wouldn't otherwise trigger any
 * revalidation. `"layout"` rather than a specific slug because which
 * post(s) reference a given image isn't known from either hook.
 *
 * `revalidatePath` only works inside a Next.js request's async-local-
 * storage context. Called from a plain Node process instead - the
 * `backfill-blog-image-blur` script, `payload migrate`, any other
 * `payload run` - it throws "Invariant: static generation store
 * missing". That's expected and harmless there (no running Next
 * server means no ISR cache to bust), so only that specific failure
 * is swallowed; anything else still surfaces.
 */
export function revalidateStories() {
  try {
    revalidatePath("/about/our-stories", "layout");
  } catch (error) {
    if (error instanceof Error && error.message.includes("static generation store missing")) return;
    throw error;
  }
}
