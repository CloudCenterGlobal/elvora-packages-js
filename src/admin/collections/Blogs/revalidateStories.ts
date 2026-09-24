import { revalidatePath } from "next/cache";

// Busts the story listing + every story page beneath it. Swallows the
// "static generation store missing" error that revalidatePath throws
// outside a Next.js request (e.g. from a payload run script) - harmless
// there since there's no ISR cache to bust.
export function revalidateStories() {
  try {
    revalidatePath("/about/our-stories", "layout");
  } catch (error) {
    if (error instanceof Error && error.message.includes("static generation store missing")) return;
    throw error;
  }
}
