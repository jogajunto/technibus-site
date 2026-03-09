import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

import { cn } from "@/utilities/cn";

const postArchiveVariants = cva("grid auto-rows-min itens-start gap-x-6 gap-y-8", {
  variants: {
    variant: {
      none: "",
      "4-cols": "sm:grid-cols-2 xl:grid-cols-4",
      "3-cols": "sm:grid-cols-2 xl:grid-cols-3",
      "2-cols": "sm:grid-cols-2 xl:grid-cols-2",
      "1-col": "grid-cols-1",
    },
  },
  defaultVariants: {
    variant: "3-cols",
  },
});

type PostGridProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof postArchiveVariants>;

export function PostGrid({ children, variant, className }: PostGridProps) {
  return <div className={cn(postArchiveVariants({ variant }), className)}>{children}</div>;
}
