import { MostRead } from "@/components/MostRead";
import { Suspense } from "react";
import AdsSlot from "../AdsSlot";

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <AdsSlot variant="sidebarTopo" slotId="sidebar-topo" />
      </Suspense>

      <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <MostRead />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <AdsSlot variant="sidebarMeio" slotId="sidebar-meio" />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <AdsSlot variant="sidebarMeio2" slotId="sidebar-meio-2" />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <AdsSlot variant="sidebarBase" slotId="sidebar-base" />
      </Suspense>
    </aside>
  );
}
