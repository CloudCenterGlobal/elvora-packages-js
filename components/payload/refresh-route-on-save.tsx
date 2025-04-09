"use client";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter();

  const serverURL = useMemo(() => {
    if (typeof window === "undefined") return "";
    const { protocol, host } = window.location;
    return `${protocol}//${host}`;
  }, []);

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={serverURL} />;
};

export { RefreshRouteOnSave };
