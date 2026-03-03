import { Topbar as TopbarGlobalType } from "@/payload-types";

import { Countdown } from "@/components/Countdown";
import { RichText } from "@/components/RichText";

type TopbarProps = TopbarGlobalType;

export function Topbar({ enable, content, countdownDate }: TopbarProps) {
  if (!enable) return null;

  return (
    <div className="bg-brand-primary text-on-brand-primary py-3">
      <div className="container">
        <div className="texst-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {content && <RichText data={content} />}
          {countdownDate && <Countdown className="max-lg:order-last max-lg:basis-full" targetDate={countdownDate} />}
        </div>
      </div>
    </div>
  );
}
