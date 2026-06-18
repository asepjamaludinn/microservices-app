import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/orders", {
    queryString: searchParams.toString(),
    errorMessage: "Gagal mengambil data pesanan",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/orders", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat pesanan",
  });
}
