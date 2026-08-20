import { apiFetch } from "@/lib/api/client";
import type { CreateOrderInput, Order } from "@/types/order";

export function createOrder(input: CreateOrderInput) {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
