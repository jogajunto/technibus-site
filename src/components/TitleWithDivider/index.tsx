import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utilities/cn";

const sectionHeadingVariants = cva("border-secondary relative flex items-end gap-6 border-b pb-3");

type SectionHeadingProps = React.HTMLAttributes<HTMLDivElement>;

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(sectionHeadingVariants(), className)} {...props} />;
});

SectionHeading.displayName = "SectionHeading";

const sectionHeadingTitleVariants = cva("text-brand-primary font-medium", {
  variants: {
    size: {
      sm: "md:text-xl subheading",
      lg: "subheading",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type SectionHeadingTitleProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof sectionHeadingTitleVariants> & {
    asChild?: boolean;
  };

const SectionHeadingTitle = React.forwardRef<HTMLHeadingElement, SectionHeadingTitleProps>(({ className, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "h2";

  return <Comp ref={ref} className={cn(sectionHeadingTitleVariants({ size }), className)} {...props} />;
});

SectionHeadingTitle.displayName = "SectionHeadingTitle";

type SectionHeadingActionsProps = React.HTMLAttributes<HTMLDivElement>;

const SectionHeadingActions = React.forwardRef<HTMLDivElement, SectionHeadingActionsProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("ml-auto shrink-0", className)} {...props} />;
});

SectionHeadingActions.displayName = "SectionHeadingActions";

export { SectionHeading, SectionHeadingActions, SectionHeadingTitle };
