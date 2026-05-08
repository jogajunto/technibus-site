import { Category, Media, Post, Search } from "@/payload-types";
import { tv, type VariantProps } from "tailwind-variants";

import { PayloadImage, PayloadSize } from "@/components/Payload/Image";
import Link from "next/link";

const card = tv({
  slots: {
    root: "group block h-full space-y-6 relative transition-all duration-300",
    image: "rounded aspect-[16/10] object-cover",
    meta: "uppertitle",
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

export type CardProps = {
  payloadSize?: PayloadSize;
  disable?: {
    image?: boolean;
    excerpt?: boolean;
    category?: boolean;
  };
} & (Post | Search) &
  CardVariants;

export function Card({ category, title, excerpt, image, relPermalink, size, hat, payloadSize = "large", disable = { image: false, excerpt: false, category: false } }: CardProps) {
  const slot = card({ size });

  return (
    <article className={slot.root()}>
      {!disable?.image && (
        <div className="border-secondary bg-secondary relative aspect-[16/10] overflow-hidden rounded border">
          <PayloadImage
            className="absolute size-full object-cover transition-transform duration-300 group-focus-within:scale-105 group-hover:scale-105"
            image={image as Media}
            disableCaption
            payloadSize={payloadSize}
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          {hat && <p className={slot.meta()}>{hat}</p>}
          <h2 className={slot.title()}>{title}</h2>
          {!disable?.category && (
            <ul className="relative z-10 flex flex-wrap gap-2">
              {category.map((cat) => {
                const c = cat as Category;
                return (
                  <li key={c.id}>
                    <Link className="tag" href={c.relPermalink}>
                      {c.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!disable?.excerpt && <p className={slot.description()}>{excerpt}</p>}
      </div>
      <Link className="absolute inset-0 size-full rounded" href={relPermalink}>
        <span className="sr-only">Ler matéria {title}</span>
      </Link>
    </article>
  );
}
