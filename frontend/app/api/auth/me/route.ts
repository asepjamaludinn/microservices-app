import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthServiceUrl } from "@/lib/server-auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak memiliki akses (Unauthenticated)" },
        { status: 401 },
      );
    }

    const authUrl = getAuthServiceUrl();

    const backendResponse = await fetch(`${authUrl}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: responseData.message || "Gagal mengambil data pengguna" },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json({ user: responseData.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server Gateway" },
      { status: 500 },
    );
  }
}
