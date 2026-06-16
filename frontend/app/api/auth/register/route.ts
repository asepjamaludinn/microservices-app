import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const authUrl = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";

    const backendResponse = await fetch(`${authUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Registrasi gagal" },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(
      { message: "Registrasi berhasil, silakan login", user: data.user },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server Gateway" },
      { status: 500 },
    );
  }
}
