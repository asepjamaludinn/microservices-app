import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projectUrl =
      process.env.PROJECT_SERVICE_URL || "http://127.0.0.1:8002";
    const backendResponse = await fetch(`${projectUrl}/api/analytics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat Analytics" },
      { status: 500 },
    );
  }
}
