import { proxyRequest } from "@/lib/api-proxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/register", {
    method: "POST",
    body,
    service: "auth",
    requiresAuth: false,
    errorMessage: "Registrasi gagal",
  });
}
