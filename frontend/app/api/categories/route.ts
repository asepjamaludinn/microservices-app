import { proxyRequest } from "@/lib/api-proxy";

export async function GET() {
  return proxyRequest("/api/categories", {
    requiresAuth: false,
    errorMessage: "Gagal memuat kategori",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/categories", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat kategori",
  });
}
