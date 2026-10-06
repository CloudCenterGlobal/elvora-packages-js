"use client";

import { Button, ConfirmationModal, toast, useConfig, useDocumentInfo, useModal } from "@payloadcms/ui";
import { useState } from "react";

const MODAL_SLUG = "send-user-invitation";

const SendInvitationButton = () => {
  const { id } = useDocumentInfo();
  const { openModal } = useModal();
  const [isSending, setIsSending] = useState(false);
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig();

  if (!id) {
    return null;
  }

  const onConfirm = async () => {
    setIsSending(true);

    try {
      const response = await fetch(`${serverURL}${api}/users/${id}/send-invitation`, {
        method: "POST",
        credentials: "include",
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(body.message ?? "Unable to send the invitation.");
        return;
      }

      toast.success("Invitation queued and will be sent shortly.");
    } catch (error) {
      console.error("Failed to send user invitation.", error);
      toast.error("Unable to send the invitation.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button buttonStyle="secondary" disabled={isSending} size="small" onClick={() => openModal(MODAL_SLUG)}>
        {isSending ? "Sending..." : "Send invitation"}
      </Button>
      <ConfirmationModal
        body="The user will receive a link that lets them set their password. The link expires after 15 minutes."
        confirmLabel="Send invitation"
        confirmingLabel="Sending..."
        heading="Send this user an invitation?"
        modalSlug={MODAL_SLUG}
        onConfirm={onConfirm}
      />
    </>
  );
};

export { SendInvitationButton };
