import { cn } from "@/utilities/cn";
import { Skeleton } from "../ui/skeleton";

type AdPosition = "main" | "main-premium" | "sidebar-top" | "sidebar-top-premium" | "sidebar-middle" | "sidebar-middle-premium" | "sidebar-bottom" | "sidebar-bottom-premium";

type AdConfig = {
  desktop: { width: number; height: number };
  mobile?: { width: number; height: number };
};

const AD_SIZES: Record<AdPosition, AdConfig> = {
  main: {
    desktop: { width: 970, height: 90 },
    mobile: { width: 320, height: 50 },
  },
  "main-premium": {
    desktop: { width: 970, height: 250 },
    mobile: { width: 320, height: 100 },
  },
  "sidebar-top": {
    desktop: { width: 300, height: 250 },
  },
  "sidebar-top-premium": {
    desktop: { width: 300, height: 600 },
  },
  "sidebar-middle": {
    desktop: { width: 300, height: 250 },
  },
  "sidebar-middle-premium": {
    desktop: { width: 300, height: 600 },
  },
  "sidebar-bottom": {
    desktop: { width: 300, height: 250 },
  },
  "sidebar-bottom-premium": {
    desktop: { width: 300, height: 600 },
  },
};

type AdsProps = {
  position: AdPosition;
  className?: string;
};

export default function Ads({ position, className }: AdsProps) {
  const config = AD_SIZES[position];

  return (
    <div className={cn("w-full", className)}>
      <Skeleton className="block w-full md:hidden" style={{ aspectRatio: `${config.mobile?.width ?? config.desktop.width} / ${config.mobile?.height ?? config.desktop.height}` }} />
      <Skeleton className="hidden w-full md:block" style={{ aspectRatio: `${config.desktop.width} / ${config.desktop.height}` }} />
    </div>
  );
}
