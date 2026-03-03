import Link from "next/link";

import { Category, Media } from "@/payload-types";
import { tv, type VariantProps } from "tailwind-variants";

import { PayloadImage } from "@/components/Payload/Image";

const card = tv({
  slots: {
    root: "group block h-full space-y-6 rounded-lg p-3 transition-all duration-300 hover:bg-primary hover:shadow-lg",
    image: "rounded aspect-[16/9] object-cover",
    meta: "text-regal-blue-950 text-xs tracking-wider uppercase",
    title: "text-primary text-balance",
    description: "text-secondary line-clamp-3 text-sm",
  },
  variants: {
    size: {
      sm: { title: "text-base" },
      lg: { title: "text-2xl" },
    },
    withImage: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: "sm",
    withImage: true,
  },
});

type CardVariants = VariantProps<typeof card>;

type CardProps = {
  categories: Category[];
  title: string;
  description?: string;
  image?: Media;
  url: string;
} & CardVariants;

export function Card({ categories, title, description, image, url, size }: CardProps) {
  const withImage = Boolean(image);
  const slot = card({ size, withImage });

  return (
    <Link href={url} className={slot.root()}>
      {image && <PayloadImage className={slot.image()} image={image} disableCaption />}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className={slot.meta()}>{categories?.length ? categories.map((category) => category.title).join(", ") : null}</p>
          <h2 className={slot.title()}>{title}</h2>
        </div>
        {description && size == "lg" && <p className={slot.description()}>{description}</p>}
      </div>
    </Link>
  );
}
