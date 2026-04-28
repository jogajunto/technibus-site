import Script from "next/script";

import { adsSlotConfig } from "./config";
import type { AdsSlotProps } from "./types";

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export default function AdsSlot({ variant, className, slotId, refreshIntervalMs = 30000 }: AdsSlotProps) {
  const ad = adsSlotConfig[variant];

  if (!ad) return null;

  const id = `gpt-${sanitizeId(slotId)}`;
  const scriptId = `technibus-ads-register-${sanitizeId(slotId)}`;

  const payload = {
    id,
    path: ad.path,
    sizes: ad.sizes,
    mapping: ad.mapping,
    refreshIntervalMs,
  };

  return (
    <div
      className={className}
      style={{
        minWidth: ad.minSize[0],
        minHeight: ad.minSize[1],
      }}
    >
      <div id={id} />

      <Script id={scriptId} strategy="afterInteractive">
        {`
          window.__technibusRegisterAdsSlot &&
            window.__technibusRegisterAdsSlot(${JSON.stringify(payload)});
        `}
      </Script>
    </div>
  );
}
