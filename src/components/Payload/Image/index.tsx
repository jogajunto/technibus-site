import { Media } from "@/payload-types";
import { isMediaObject } from "@/utilities/payload/is-media-object";
import Image from "next/image";

type PayloadImageProps = {
  className?: string;
  image: Media;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  disableCaption?: boolean;
};

export function PayloadImage({ image, className, width, height, loading = "lazy", disableCaption = false }: PayloadImageProps) {
  if (!isMediaObject(image)) {
    return null;
  }

  return (
    <figure>
      <Image
        key={image.id}
        className={className}
        src={image.url!}
        width={width ? width : image.width!}
        height={height ? height : image.height!}
        alt={image.alt!}
        loading={loading}
        placeholder={image.blurhash ? "blur" : "empty"}
        blurDataURL={image.blurhash || undefined}
      />
      {!disableCaption && <>{image.caption && <figcaption className="text-secondary pt-2 text-right text-sm italic">{image.caption}</figcaption>}</>}
    </figure>
  );
}
