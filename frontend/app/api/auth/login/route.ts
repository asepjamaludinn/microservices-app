import { cookies } from "next/headers";
import { NextResponse } from "next/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const authUrl = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";

    const backendResponse = await fetch(`${authUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || "Login gagal" },
        { status: backendResponse.status },
      );
    }

    const token = data.access_token;

    cookies().set({
      name: "jwt_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server Gateway" },
      { status: 500 },
    );
  }
}
