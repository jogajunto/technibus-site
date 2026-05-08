"use client";

import { Media } from "@/payload-types";
import { isMediaObject } from "@/utilities/payload/is-media-object";
import Image, { ImageLoaderProps } from "next/image";

export type PayloadSize = "thumbnail" | "medium" | "large" | "xlarge" | "original";

type PayloadImageProps = {
  className?: string;
  image: Media;
  width?: number;
  height?: number;
  alt?: string;
  loading?: "eager" | "lazy";
  disableCaption?: boolean;
  payloadSize?: PayloadSize;
  sizes?: string;
};

export function PayloadImage({ image, className, alt, width, height, loading = "lazy", disableCaption = false, payloadSize = "thumbnail", sizes = "100vw" }: PayloadImageProps) {
  if (!isMediaObject(image)) {
    return null;
  }

  const payloadLoader = ({ width: requestedWidth, quality }: ImageLoaderProps) => {
    const mediaSizes = image.sizes || {};
    let finalUrl = image.url!;

    // 1. TRAVA DE TAMANHO CMS:
    // Se você mandou a prop size="large" (ou qualquer tamanho que não seja original),
    // nós blindamos a URL. O Next.js pode até pedir 3840, mas entregaremos a versão "large".
    if (payloadSize !== "original" && mediaSizes[payloadSize as keyof typeof mediaSizes]?.url) {
      finalUrl = mediaSizes[payloadSize as keyof typeof mediaSizes]!.url!;
    }
    // 2. MODO LIVRE: Se não houver restrição do CMS (size="original"),
    // fazemos a escadinha responsiva normal para economizar banda em celulares.
    else {
      if (requestedWidth <= 300 && mediaSizes.thumbnail?.url) {
        finalUrl = mediaSizes.thumbnail.url;
      } else if (requestedWidth <= 768 && mediaSizes.medium?.url) {
        finalUrl = mediaSizes.medium.url;
      } else if (requestedWidth <= 1024 && mediaSizes.large?.url) {
        finalUrl = mediaSizes.large.url;
      } else if (requestedWidth <= 1536 && mediaSizes.xlarge?.url) {
        finalUrl = mediaSizes.xlarge.url;
      }
    }

    // Retorna a URL escolhida anexando os parâmetros que o Next.js exige
    const separator = finalUrl.includes("?") ? "&" : "?";
    return `${finalUrl}${separator}w=${requestedWidth}&q=${quality || 75}`;
  };

  let baseSrc = image.url!;
  let imgWidth = image.width!;
  let imgHeight = image.height!;

  if (payloadSize !== "original" && image.sizes && image.sizes[payloadSize as keyof typeof image.sizes]) {
    const requestedSize = image.sizes[payloadSize as keyof typeof image.sizes];
    if (requestedSize && requestedSize.url) {
      baseSrc = requestedSize.url;
      imgWidth = requestedSize.width || imgWidth;
      imgHeight = requestedSize.height || imgHeight;
    }
  }

  return (
    <figure>
      <Image
        key={image.id}
        loader={payloadLoader}
        src={baseSrc}
        className={className}
        width={width || imgWidth}
        height={height || imgHeight}
        alt={alt || image.alt || image.caption || ""}
        loading={loading}
        placeholder={image.blurhash ? "blur" : "empty"}
        blurDataURL={image.blurhash || undefined}
        sizes={sizes}
      />
      {!disableCaption && <>{image.caption && <figcaption className="text-secondary pt-2 text-right text-sm italic">{image.caption}</figcaption>}</>}
    </figure>
  );
}
