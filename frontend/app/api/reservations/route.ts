import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/reservations", {
    queryString: searchParams.toString(),
    errorMessage: "Gagal mengambil data reservasi",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/reservations", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat reservasi",
  });
}
