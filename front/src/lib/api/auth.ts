import { apiFetch } from "@/lib/api/client";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";

export function register(input: RegisterInput) {
  return apiFetch<void>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
