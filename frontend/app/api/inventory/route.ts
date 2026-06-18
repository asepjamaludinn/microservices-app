import { proxyRequest } from "@/lib/api-proxy";

export async function GET() {
  return proxyRequest("/api/inventory", {
    errorMessage: "Gagal memuat inventory",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/inventory", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat bahan baku",
  });
}
