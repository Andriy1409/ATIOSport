import { apiFetch } from "@/lib/api/client";
import type { Client } from "@/types/client";

export function getClients(token: string) {
  return apiFetch<Client[]>("/api/admin/clients", { token });
}
