import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/menus", {
    requiresAuth: false,
    queryString: searchParams.toString(),
    errorMessage: "Gagal memuat katalog menu",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/menus", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat menu",
  });
}
