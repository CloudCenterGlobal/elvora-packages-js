import { userHasPermission } from "@elvora/admin/collections/Permissions/helpers";
import { getSiteUrl } from "@elvora/utils/urls";
import type { Endpoint } from "payload";

const userInvitationEndpoint: Endpoint = {
  path: "/:id/send-invitation",
  method: "post",
  handler: async (req) => {
    if (!req.user || !(await userHasPermission(req, ["users.update"]))) {
      return Response.json({ message: "You are not allowed to send user invitations." }, { status: 403 });
    }

    const id = req.routeParams?.id;

    if (typeof id !== "string" && typeof id !== "number") {
      return Response.json({ message: "A user id is required." }, { status: 400 });
    }

    if (!req.url) {
      return Response.json({ message: "Unable to determine this site's URL." }, { status: 500 });
    }

    try {
      const { queueUserInvitation } = await import("@/lib/email/queue");

      await queueUserInvitation(req.payload, id, await getSiteUrl(new URL(req.url).origin));
    } catch (error) {
      req.payload.logger.error({ err: error, userId: id }, "Failed to queue user invitation");
      return Response.json({ message: "Unable to send the invitation." }, { status: 502 });
    }

    return Response.json({ message: "Invitation queued." });
  },
};

export { userInvitationEndpoint };
