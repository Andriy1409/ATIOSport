import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand",
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = "Select";
