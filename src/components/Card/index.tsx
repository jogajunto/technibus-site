import Link from "next/link";

import { Category, Media, Post, Search } from "@/payload-types";
import { tv, type VariantProps } from "tailwind-variants";

import { PayloadImage } from "@/components/Payload/Image";

const card = tv({
  slots: {
    root: "group block h-full space-y-6 rounded-lg  transition-all duration-300",
    image: "rounded aspect-[16/9] object-cover",
    meta: "text-regal-blue-950 text-xs tracking-wider uppercase",
    title: "text-primary group-hover:text-brand-primary text-balance",
    description: "text-secondary line-clamp-3 text-sm",
  },
  variants: {
    size: {
      sm: { title: "text-base" },
      lg: { title: "text-2xl" },
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type CardVariants = VariantProps<typeof card>;

type CardProps = {
  disable?: {
    image?: boolean;
    excerpt?: boolean;
  };
} & (Post | Search) &
  CardVariants;

export function Card({ category, title, excerpt, image, relPermalink, size, disable = { image: false, excerpt: false } }: CardProps) {
  const slot = card({ size });

  return (
    <Link href={relPermalink} className={slot.root()}>
      {!disable?.image && (
        <div className="border-secondary bg-secondary relative aspect-[16/9] overflow-hidden rounded border">
          <PayloadImage className="absolute size-full object-cover transition-transform duration-300 group-hover:scale-105" image={image as Media} disableCaption />
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className={slot.meta()}>{category?.length ? category.map((category) => (category as Category).title).join(", ") : null}</p>
          <h2 className={slot.title()}>{title}</h2>
        </div>
        {!disable?.excerpt && <p className={slot.description()}>{excerpt}</p>}
      </div>
    </Link>
  );
}
