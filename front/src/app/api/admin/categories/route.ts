import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createCategory } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";

export async function POST(request: Request) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ title: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const category = await createCategory(body, token);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message, errors: error.fieldErrors }, { status: error.status });
    }
    throw error;
  }
}
