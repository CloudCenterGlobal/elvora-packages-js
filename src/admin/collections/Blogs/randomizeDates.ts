import { userHasPermission } from "@elvora/admin/collections/Permissions/helpers";
import type { Endpoint } from "payload";
import { revalidateStories } from "./revalidateStories";

// Spreads every post's createdAt randomly between the oldest existing
// createdAt and now.
export const randomizeDatesEndpoint: Endpoint = {
  path: "/randomize-dates",
  method: "post",
  handler: async (req) => {
    if (!req.user || !(await userHasPermission(req, ["blogs.update"]))) {
      return Response.json({ message: "You are not allowed to perform this action." }, { status: 403 });
    }

    const { docs } = await req.payload.find({
      collection: "blogs",
      limit: 0,
      pagination: false,
      depth: 0,
      select: { createdAt: true },
      req,
    });

    const now = Date.now();
    const oldest = Math.min(now, ...docs.map((doc) => new Date(doc.createdAt).getTime()));

    for (const doc of docs) {
      const createdAt = new Date(oldest + Math.random() * (now - oldest)).toISOString();
      await req.payload.db.updateOne({ collection: "blogs", id: doc.id, data: { createdAt }, req });
    }

    revalidateStories();

    return Response.json({ updated: docs.length });
  },
};
