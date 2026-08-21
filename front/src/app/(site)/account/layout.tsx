import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/account";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";
import { CustomerSidebar } from "@/components/account/CustomerSidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
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

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <CustomerSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
