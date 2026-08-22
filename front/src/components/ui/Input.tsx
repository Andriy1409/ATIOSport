import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        className={cn(
          "h-10 rounded-[var(--radius-input)] border border-border bg-transparent px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand",
          error && "border-danger focus-visible:ring-danger",
          className,
        )}
        {...props}
      />
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  ),
);

Input.displayName = "Input";
