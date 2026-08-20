"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <span className="sr-only">Menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-16 z-50 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <ul className="flex flex-col gap-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          {!loading && (
            <div className="mt-3 flex flex-col gap-1 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button
                    type="button"
                    className="block rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
