import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak memiliki akses (Unauthenticated)" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const authUrl = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";

    const backendResponse = await fetch(`${authUrl}/api/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      let errorMessage = responseData.message;
      if (responseData.errors) {
        errorMessage = Object.values(responseData.errors).flat()[0] as string;
      }

      return NextResponse.json(
        { error: errorMessage || "Gagal memperbarui password" },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(
      { message: responseData.message || "Password berhasil diperbarui" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server Gateway" },
      { status: 500 },
    );
  }
}
