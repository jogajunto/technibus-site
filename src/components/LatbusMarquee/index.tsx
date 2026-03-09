import Marquee from "react-fast-marquee";

import { fetchExibithors } from "@/collections/LatBusExibithors/data";
import { Media } from "@/payload-types";
import { PayloadImage } from "../Payload/Image";

export async function LatbusMarquee() {
  const exhibitors = await fetchExibithors({
    logo: {
      exists: true,
    },
  });

  return (
    <div className="space-y-4 overflow-x-hidden">
      <Marquee direction="left" speed={40}>
        {exhibitors.map((exhibitor) => (
          <PayloadImage key={exhibitor.id} image={exhibitor.logo as Media} className="mx-5 aspect-[4/3] h-24 w-auto object-contain p-[5%]" alt={exhibitor.title} disableCaption />
        ))}
      </Marquee>
    </div>
  );
}
