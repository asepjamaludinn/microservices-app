import { proxyRequest } from "@/lib/api-proxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/update-password", {
    method: "POST",
    body,
    service: "auth",
    errorMessage: "Gagal memperbarui password",
  });
}
