import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";

export async function POST(request: Request) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const body = await request.json();

  try {
    const order = await createOrder(body, token);
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message, errors: error.fieldErrors }, { status: error.status });
    }
    throw error;
  }
}
