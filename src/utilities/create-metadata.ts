import { Media } from "@/payload-types";
import { Metadata } from "next";

type CreateMetadataProps = {
  path: string;
  title: string;
  description: string;
  image?: Media;
  prev?: string;
  next?: string;
  noIndex?: boolean;
};

export function createMetadata({ path, title, description, prev, next, image, noIndex = false }: CreateMetadataProps): Metadata {
  const baseUrl = process.env.SITE_URL!;
  const siteTitle = process.env.SITE_TITLE!;
  const url = `${baseUrl}${path}`;

  const imageUrl = image?.url || `${baseUrl}/opengraph-image.png`;
  const imageWidth = image?.width || 1200;
  const imageHeight = image?.height || 630;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      siteName: siteTitle,
      locale: "pt_BR",
      type: "website",
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          type: image?.url ? "image/jpeg" : "image/png",
          alt: image?.alt || siteTitle,
        },
      ],
    },
    other: {
      ...(prev ? { "link:prev": `${baseUrl}${prev}` } : {}),
      ...(next ? { "link:next": `${baseUrl}${next}` } : {}),
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
        }
      : {}),
  };
}
