import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const projectUrl =
      process.env.PROJECT_SERVICE_URL || "http://127.0.0.1:8002";

    const backendResponse = await fetch(
      `${projectUrl}/api/orders?${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Gagal membuat pesanan" },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghubungi Project Service" },
      { status: 500 },
    );
  }
}
