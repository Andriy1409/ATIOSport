import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-[var(--radius-button)] px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      neutral: "bg-surface text-muted-foreground",
      danger: "bg-danger/10 text-danger",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      accent: "bg-accent-tint text-accent-tint-ink",
      "accent-2": "bg-accent-2-tint text-accent-2-tint-ink",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
