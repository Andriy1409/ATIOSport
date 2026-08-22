import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";

async function getToken() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ title: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const category = await updateCategory(id, body, token);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message, errors: error.fieldErrors }, { status: error.status });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ title: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteCategory(id, token);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.message }, { status: error.status });
    }
    throw error;
  }
}
