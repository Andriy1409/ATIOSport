import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getClients } from "@/lib/api/adminClients";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ title: "Unauthorized" }, { status: 401 });
  }

  try {
    const clients = await getClients(token);
    return NextResponse.json(clients);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message }, { status: error.status });
    }
    throw error;
  }
}
