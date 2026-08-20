import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/api/account";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(null);
  }

  try {
    const user = await getCurrentUser(token);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json(null);
    }
    throw error;
  }
}
