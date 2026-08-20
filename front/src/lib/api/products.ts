import { apiFetch } from "@/lib/api/client";
import type { CreateProductInput, Product, UpdateProductInput } from "@/types/product";

export function getProducts() {
  return apiFetch<Product[]>("/api/products");
}

export function getProductById(id: string) {
  return apiFetch<Product>(`/api/products/${id}`);
}

export function createProduct(input: CreateProductInput, token: string) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function updateProduct(id: string, input: UpdateProductInput, token: string) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token,
  });
}

export function deleteProduct(id: string, token: string) {
  return apiFetch<void>(`/api/products/${id}`, {
    method: "DELETE",
    token,
  });
}
