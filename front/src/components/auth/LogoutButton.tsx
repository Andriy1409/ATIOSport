"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(redirectTo);
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
