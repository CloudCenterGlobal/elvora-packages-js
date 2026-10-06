"use client";

import { Button, ConfirmationModal, toast, useConfig, useModal } from "@payloadcms/ui";
import { useState } from "react";
import type { FormSubmissionCollection } from "@/lib/email/form-submission-content";

type SendNotificationButtonProps = {
  collection: FormSubmissionCollection;
  id: number | string;
};

const MODAL_SLUG = "send-form-submission-notification";

const SendNotificationButton = ({ collection, id }: SendNotificationButtonProps) => {
  const { openModal } = useModal();
  const [isSending, setIsSending] = useState(false);
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig();

  const onConfirm = async () => {
    setIsSending(true);

    try {
      const response = await fetch(`${serverURL}${api}/${collection}/${id}/send-notification`, {
        method: "POST",
        credentials: "include",
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(body.message ?? "Unable to resend the notification.");
        return;
      }

      toast.success("Notification queued and will be sent shortly.");
    } catch (error) {
      console.error("Failed to resend form-submission notification.", error);
      toast.error("Unable to resend the notification.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button buttonStyle="secondary" disabled={isSending} size="small" onClick={() => openModal(MODAL_SLUG)}>
        {isSending ? "Sending..." : "Resend notification"}
      </Button>
      <ConfirmationModal
        body="This will send the current submission details to every configured form-notification recipient."
        confirmLabel="Send notification"
        confirmingLabel="Sending..."
        heading="Resend this notification?"
        modalSlug={MODAL_SLUG}
        onConfirm={onConfirm}
      />
    </>
  );
};

export { SendNotificationButton };
