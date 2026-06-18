import { NextResponse } from "next/server";
import { getJwtToken, getProjectServiceUrl } from "@/lib/server-auth";
import {
  gatewayError,
  getErrorMessage,
  readJsonSafe,
} from "@/lib/api-response";

export async function GET(request: Request) {
  const token = await getJwtToken();

  if (!token) {
    return gatewayError("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectUrl = getProjectServiceUrl();

    const backendResponse = await fetch(
      `${projectUrl}/api/orders?${searchParams.toString()}`,
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
    return gatewayError("Gagal mengambil data pesanan");
  }
}

export async function POST(request: Request) {
  const token = await getJwtToken();

  if (!token) {
    return gatewayError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const projectUrl = getProjectServiceUrl();

    const backendResponse = await fetch(`${projectUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await readJsonSafe(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          status: "Error",
          error: getErrorMessage(data, "Gagal membuat pesanan"),
          data,
        },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return gatewayError("Gagal menghubungi Project Service");
  }
}
