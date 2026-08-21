import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/account";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const user = await getCurrentUser(token).catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  });

  if (!user || !user.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-lg font-bold tracking-tight">
              AtioSport Admin
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/admin/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Products
              </Link>
              <Link href="/admin/clients" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Clients
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
              Back to store
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
