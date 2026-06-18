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
    const res = await fetch(`${projectUrl}/api/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat inventory" },
      { status: 500 },
    );
  }
}
