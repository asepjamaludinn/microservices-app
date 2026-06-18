import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/reviews", {
    requiresAuth: false,
    queryString: searchParams.toString(),
    errorMessage: "Gagal memuat review",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/reviews", {
    method: "POST",
    body,
    errorMessage: "Gagal mengirim review",
  });
}
