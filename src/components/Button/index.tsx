import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-on-brand-primary hover:bg-brand-primary-hover disabled:bg-disabled disabled:text-on-disabled",
        secondary: "bg-brand-secondary text-on-brand-primary hover:bg-brand-primary-hover disabled:bg-disabled disabled:text-on-disabled",
        // destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "",
        neutral: "bg-primary hover:bg-primary text-primary border border-primary hover:border-brand-tertiary text-brand-primary",
        // secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:text-on-brand-tertiary hover:bg-brand-tertiary-hover",
        subtle: "text-brand-primary hover:text-on-brand-tertiary",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-lg has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-4 has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
