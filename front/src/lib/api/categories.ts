import { apiFetch } from "@/lib/api/client";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export function getCategories() {
  return apiFetch<Category[]>("/api/categories");
}

export function createCategory(input: CreateCategoryInput, token: string) {
  return apiFetch<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function updateCategory(id: string, input: UpdateCategoryInput, token: string) {
  return apiFetch<Category>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token,
  });
}

export function deleteCategory(id: string, token: string) {
  return apiFetch<void>(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
}
