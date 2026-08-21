import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary dark:border-zinc-700 dark:bg-zinc-950",
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = "Select";
