import { Post } from "@/payload-types";
import { User } from "@sentry/nextjs";

export const articleSchema = (props: Post) => {
  const rawImageUrl = props.image && typeof props.image === "object" ? props.image.url : undefined;
  const image = rawImageUrl ? encodeURI(decodeURI(rawImageUrl)) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: props.title,
    datePublished: new Date(props.publishedDate).toISOString(),
    dateModified: new Date(props.updatedAt).toISOString(),
    ...(image ? { image } : {}),
    author: [
      {
        "@type": "Person",
        name: (props.author as User).name,
        url: `${process.env.SITE_URL}${(props.author as User).relPermalink}`,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: process.env.SITE_TITLE,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.SITE_URL}/logo-technibus-positive.svg`,
        width: "377",
        height: "190",
      },
    },
  };
};
