import { NextResponse } from "next/server";
import {
  getJwtToken,
  getProjectServiceUrl,
  getAuthServiceUrl,
} from "@/lib/server-auth";
import {
  gatewayError,
  getErrorMessage,
  readJsonSafe,
} from "@/lib/api-response";

type ProxyOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  service?: "project" | "auth";
  requiresAuth?: boolean;
  errorMessage?: string;
  queryString?: string;
};

export async function proxyRequest(path: string, options: ProxyOptions = {}) {
  const {
    method = "GET",
    body,
    service = "project",
    requiresAuth = true,
    errorMessage = "Terjadi kesalahan pada server",
    queryString = "",
  } = options;

  const headers: Record<string, string> = { Accept: "application/json" };

  if (requiresAuth) {
    const token = await getJwtToken();
    if (!token) return gatewayError("Unauthorized", 401);
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) headers["Content-Type"] = "application/json";

  const baseUrl =
    service === "project" ? getProjectServiceUrl() : getAuthServiceUrl();
  const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const data = await readJsonSafe(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "Error",
          error: getErrorMessage(data, errorMessage),
          data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return gatewayError(`Gagal menghubungi ${service} service`);
  }
}
