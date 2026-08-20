import { apiFetch } from "@/lib/api/client";
import type { Category } from "@/types/category";

export function getCategories() {
  return apiFetch<Category[]>("/api/categories");
}
