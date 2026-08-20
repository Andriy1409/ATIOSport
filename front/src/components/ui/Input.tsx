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
          "h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary dark:border-zinc-700",
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
