import { Ads } from "@/components/Ads";
import { MostRead } from "@/components/MostRead";
import { Suspense } from "react";

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <Ads variant="sidebarTopo" />
      </Suspense>

      <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <MostRead />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <Ads variant="sidebarMeio" />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <Ads variant="sidebarMeio2" />
      </Suspense>

      <Suspense fallback={<div className="h-[250px] w-full animate-pulse rounded-lg bg-neutral-200" />}>
        <Ads variant="sidebarBase" />
      </Suspense>
    </aside>
  );
}
