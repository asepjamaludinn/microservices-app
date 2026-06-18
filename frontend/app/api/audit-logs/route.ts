import { NextResponse } from "next/server";
import { getJwtToken, getProjectServiceUrl } from "@/lib/server-auth";
import { gatewayError, readJsonSafe } from "@/lib/api-response";

export async function GET(request: Request) {
  const token = await getJwtToken();

  if (!token) {
    return gatewayError("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectUrl = getProjectServiceUrl();

    const backendResponse = await fetch(
      `${projectUrl}/api/audit-logs?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await readJsonSafe(backendResponse);

    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return gatewayError("Gagal memuat audit logs");
  }
}
