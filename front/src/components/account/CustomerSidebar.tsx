"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/hooks/useCartStore";
import { LogoutButton } from "@/components/auth/LogoutButton";

const cartItem = {
  href: "/cart",
  label: "Cart",
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const navItems = [
  {
    href: "/account",
    label: "Personal information",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.3-4.2 4.2-6.5 7.5-6.5s6.2 2.3 7.5 6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/account/orders",
    label: "My orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16l-1.5 13.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 4z" strokeLinejoin="round" />
        <path d="M8 4V3a4 4 0 018 0v1" />
        <line x1="8" y1="9" x2="16" y2="9" strokeLinecap="round" />
      </svg>
    ),
  },
];

function NavLinks({
  pathname,
  itemCount,
  onNavigate,
}: {
  pathname: string;
  itemCount: number;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Link
        href={cartItem.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
          pathname === cartItem.href ? "bg-brand/15 text-foreground" : "text-muted-foreground hover:bg-surface-hover",
        )}
      >
        {cartItem.icon}
        {cartItem.label}
        {itemCount > 0 && (
          <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Link>

      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
              active ? "bg-brand/15 text-foreground" : "text-muted-foreground hover:bg-surface-hover",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}

      <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground opacity-45">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20s-7-4.35-9.5-8.5C.7 8.1 2 4.5 5.5 4c2-.3 3.7.7 4.5 2.2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 4.8 4.1 3 7.5C15 15.65 12 20 12 20z" strokeLinejoin="round" />
        </svg>
        Liked
        <span className="ml-auto rounded-full bg-surface-hover px-2 py-0.5 text-[10px]">soon</span>
      </div>
    </div>
  );
}

export function CustomerSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-[248px] lg:flex-shrink-0 lg:flex-col lg:gap-6 lg:self-start lg:rounded-md lg:border lg:border-border lg:bg-surface lg:px-3 lg:py-5">
        <NavLinks pathname={pathname} itemCount={itemCount} />
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold">Account menu</span>
        <button
          type="button"
          aria-label="Toggle account menu"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-surface-hover"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-6 rounded-md border border-border bg-surface px-4 py-4 lg:hidden">
          <NavLinks pathname={pathname} itemCount={itemCount} onNavigate={() => setOpen(false)} />
          <LogoutButton />
        </div>
      )}
    </>
  );
}
