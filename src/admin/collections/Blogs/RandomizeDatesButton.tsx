"use client";

import { Button, ConfirmationModal, toast, useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

const MODAL_SLUG = "randomize-blog-dates";

export function RandomizeDatesButton() {
  const { openModal } = useModal();
  const router = useRouter();
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig();

  const onConfirm = async () => {
    const res = await fetch(`${serverURL}${api}/blogs/randomize-dates`, {
      method: "POST",
      credentials: "include",
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(body.message ?? "Failed to randomize dates");
      return;
    }

    toast.success(`Randomized dates on ${body.updated} posts`);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button buttonStyle="secondary" size="small" onClick={() => openModal(MODAL_SLUG)}>
        Randomize dates
      </Button>
      <ConfirmationModal
        modalSlug={MODAL_SLUG}
        heading="Randomize blog post dates?"
        body="Every blog post's created date will be set to a random date between the oldest post's date and today. This can't be undone."
        confirmLabel="Randomize"
        confirmingLabel="Randomizing..."
        onConfirm={onConfirm}
      />
    </div>
  );
}
