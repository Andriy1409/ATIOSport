"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Category } from "@/types/category";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-button)] hover:bg-surface"
      >
        <span className="sr-only">Menu</span>
        {open ? <X strokeWidth={2} className="h-5.5 w-5.5" /> : <Menu strokeWidth={2} className="h-5.5 w-5.5" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-16 z-50 border-t border-border bg-surface p-4">
          <ul className="flex flex-col gap-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/catalog"
                className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                onClick={() => setOpen(false)}
              >
                Catalog
              </Link>
            </li>
          </ul>

          {!loading && (
            <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                      onClick={() => setOpen(false)}
                    >
                      Admin panel
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                    onClick={() => setOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button
                    type="button"
                    className="block rounded-[var(--radius-button)] px-3 py-2 text-left text-sm font-medium hover:bg-surface-hover"
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                      router.refresh();
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface-hover"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
