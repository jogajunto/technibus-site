export type AdSize = [number, number];

export type AdsSlotVariant = "sidebarTopo" | "sidebarMeio" | "sidebarMeio2" | "sidebarBase" | "principalDesktop" | "principalMobile";

export type AdsSlotProps = {
  variant: AdsSlotVariant;
  slotId: string;
  className?: string;
  refreshIntervalMs?: number | null;
};

export type AdsSlotConfig = Record<
  AdsSlotVariant,
  {
    path: string;
    sizes: AdSize[];
    minSize: AdSize;
    mapping?: "wide" | "sidebar";
  }
>;
