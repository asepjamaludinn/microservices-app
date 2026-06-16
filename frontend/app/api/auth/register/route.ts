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

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      let errorMessage = responseData.message;
      if (responseData.errors) {
        errorMessage = Object.values(responseData.errors).flat()[0] as string;
      }

      return NextResponse.json(
        { error: errorMessage || "Registrasi gagal" },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(
      {
        message: responseData.message || "Registrasi berhasil, silakan login",
        user: responseData.data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server Gateway" },
      { status: 500 },
    );
  }
}
