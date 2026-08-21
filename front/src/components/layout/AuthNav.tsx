"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export function AuthNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="h-9 w-16" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Log in
        </Link>
        <Link href="/register" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.isAdmin && (
        <Link href="/admin/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Admin panel
        </Link>
      )}
      <Link href="/account" className="text-sm font-medium hover:underline">
        {user.name}
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await logout();
          router.refresh();
        }}
      >
        Log out
      </Button>
    </div>
  );
}
