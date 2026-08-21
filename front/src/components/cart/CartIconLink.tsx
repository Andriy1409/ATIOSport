"use client";

import Link from "next/link";
import { useCartHydrated, useCartStore } from "@/hooks/useCartStore";

export function CartIconLink() {
  const hydrated = useCartHydrated();
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-11 w-11 items-center justify-center rounded-md hover:bg-surface"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {hydrated && itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
