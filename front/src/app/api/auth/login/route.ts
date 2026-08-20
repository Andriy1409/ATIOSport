import { NextResponse } from "next/server";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/authCookie";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { token } = await login(body);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message }, { status: error.status });
    }
    throw error;
  }
}
