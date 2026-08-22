"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartHydrated, useCartStore } from "@/hooks/useCartStore";

export function CartIconLink() {
  const hydrated = useCartHydrated();
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-button)] hover:bg-surface"
    >
      <ShoppingCart strokeWidth={2} className="h-5 w-5" />
      {hydrated && itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
