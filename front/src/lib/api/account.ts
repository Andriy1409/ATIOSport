import { apiFetch } from "@/lib/api/client";
import type { CurrentUser } from "@/types/auth";

export function getCurrentUser(token: string) {
  return apiFetch<CurrentUser>("/api/account/me", { token });
}
