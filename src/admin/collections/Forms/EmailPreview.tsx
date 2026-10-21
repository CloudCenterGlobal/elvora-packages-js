import { getFormSubmissionContent, type FormSubmissionCollection } from "@/lib/email/form-submission-content";
import { formSubmissionAdminPath } from "@/lib/email/form-submission-path";
import { getSiteUrl } from "@elvora/utils/urls";
import type { DocumentViewServerProps } from "payload";
import { SendNotificationButton } from "./SendNotificationButton";

const FormSubmissionEmailPreview = async ({
  initPageResult,
  doc,
}: DocumentViewServerProps) => {
  const collectionSlug = initPageResult.collectionConfig?.slug as FormSubmissionCollection | undefined;

  if (!collectionSlug) {
    throw new Error("Email preview is not available for this collection.");
  }

  const preview = getFormSubmissionContent(collectionSlug, doc);
  const { renderFormSubmissionEmail } = await import("@/lib/email/form-submission-email");
  const html = await renderFormSubmissionEmail({
    title: preview.title,
    description: preview.description,
    fields: preview.fields,
    submissionUrl: `${await getSiteUrl(() => new URL(initPageResult.req.url!).origin)}${formSubmissionAdminPath(collectionSlug, doc.id)}`,
  });

  return (
    <main style={{ maxWidth: "900px", padding: "32px" }}>
      <h1 style={{ marginBottom: "8px" }}>Email notification preview</h1>
      <p style={{ marginBottom: "24px" }}>This is the notification sent to the configured form-submission recipients.</p>
      <SendNotificationButton collection={collectionSlug} id={doc.id} />
      <iframe
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        srcDoc={html}
        style={{ border: "1px solid #d1d5db", borderRadius: "4px", height: "800px", width: "100%" }}
        title="Form submission email notification"
      />
    </main>
  );
};

export { FormSubmissionEmailPreview };
