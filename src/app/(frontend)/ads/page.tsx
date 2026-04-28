import { createMetadata } from "@/utilities/create-metadata";

import AdsSlot from "@/components/AdsSlot";

export function generateMetadata() {
  return createMetadata({
    path: "/ads",
    title: "Ads",
    description: "...",
    noIndex: true,
  });
}

export default function Page() {
  return (
    <main>
      <div className="section pt-4">
        <div className="container flex flex-col gap-4">
          <AdsSlot variant="sidebarTopo" slotId="sidebar-topo-ads" />
          <AdsSlot variant="sidebarMeio" slotId="sidebar-meio-ads" />
          <AdsSlot variant="sidebarMeio2" slotId="sidebar-meio-2-ads" />
          <AdsSlot variant="sidebarBase" slotId="sidebar-base-ads" />
        </div>
      </div>
    </main>
  );
}
