import { NextResponse } from "next/server";
import { getJwtToken, getProjectServiceUrl } from "@/lib/server-auth";
import {
  gatewayError,
  getErrorMessage,
  readJsonSafe,
} from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getJwtToken();

  if (!token) {
    return gatewayError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { id } = await params;
    const projectUrl = getProjectServiceUrl();

    const backendResponse = await fetch(`${projectUrl}/api/inventory/${id}`, {
      method: "PUT",
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
          error: getErrorMessage(data, "Gagal update bahan baku"),
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getJwtToken();

  if (!token) {
    return gatewayError("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    const projectUrl = getProjectServiceUrl();

    const backendResponse = await fetch(`${projectUrl}/api/inventory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await readJsonSafe(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          status: "Error",
          error: getErrorMessage(data, "Gagal menghapus bahan baku"),
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
