import type { SendStoredFormSubmissionNotification } from "@/lib/email/form-submission-service";
import { getSiteUrl } from "@elvora/utils/urls";
import type { Endpoint } from "payload";

const formSubmissionNotificationEndpoint = (
  collection: SendStoredFormSubmissionNotification["collection"],
): Endpoint => ({
  path: "/:id/send-notification",
  method: "post",
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ message: "You must be signed in to resend a notification." }, { status: 401 });
    }

    const id = req.routeParams?.id;

    if (typeof id !== "string" && typeof id !== "number") {
      return Response.json({ message: "A form submission id is required." }, { status: 400 });
    }

    // Confirms the submission exists and that this user may read it before anything is queued.
    await req.payload.findByID({
      collection,
      id,
      depth: 0,
      req,
    });

    if (!req.url) {
      return Response.json({ message: "Unable to determine this site's URL." }, { status: 500 });
    }

    const requestOrigin = new URL(req.url).origin;

    try {
      const origin = await getSiteUrl(requestOrigin);

      await req.payload.jobs.queue({
        task: "send-form-submission-notification",
        input: {
          collection,
          id: String(id),
          submissionUrl: `${origin}/admin/collections/${collection}/${id}/email-preview`,
        },
      });
    } catch (error) {
      req.payload.logger.error({ err: error, collection, id }, "Failed to queue form-submission notification");
      return Response.json({ message: "Unable to resend the notification." }, { status: 502 });
    }

    return Response.json({ message: "Notification queued." });
  },
});

export { formSubmissionNotificationEndpoint };
