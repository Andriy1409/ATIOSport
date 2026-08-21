"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" strokeLinejoin="round" />
        <path d="M3 8l9 5 9-5" strokeLinejoin="round" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    href: "/admin/clients",
    label: "Clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c1-3.6 3.5-5.5 6.5-5.5s5.5 1.9 6.5 5.5" strokeLinecap="round" />
        <circle cx="17.5" cy="9" r="2.6" />
        <path d="M15.5 14.3c2.6.3 4.4 2 5.2 5.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const comingSoonItems = [
  {
    label: "Orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="6" width="22" height="13" rx="2" />
        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-2 px-2 py-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-primary">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" strokeLinecap="round" />
      </svg>
      <span className="text-base font-bold tracking-tight">
        AtioSport <span className="text-brand">Admin</span>
      </span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
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
      {comingSoonItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground opacity-45"
        >
          {item.icon}
          {item.label}
          <span className="ml-auto rounded-full bg-surface-hover px-2 py-0.5 text-[10px]">soon</span>
        </div>
      ))}
    </div>
  );
}

function FooterLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-hover"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to store
      </Link>
      <LogoutButton redirectTo="/login" />
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-[248px] lg:flex-shrink-0 lg:flex-col lg:gap-6 lg:border-r lg:border-border lg:bg-surface lg:px-3 lg:py-5">
        <Logo />
        <NavLinks pathname={pathname} />
        <div className="mt-auto">
          <FooterLinks />
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label="Toggle admin menu"
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
        <div className="flex flex-col gap-6 border-b border-border bg-surface px-4 py-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <FooterLinks onNavigate={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
