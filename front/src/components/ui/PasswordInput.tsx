"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn(
              "h-10 w-full rounded-md border border-border bg-transparent px-3 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand",
              error && "border-danger focus-visible:ring-danger",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-10-8-10-8a18.9 18.9 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 10 8 10 8a18.9 18.9 0 01-3.15 4.33" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
