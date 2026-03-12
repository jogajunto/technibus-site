"use client";

import { getClientSideURL } from "@/utilities/payload/get-url";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation.js";

export default function RefreshRouteOnSave() {
  const router = useRouter();
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />;
}
