import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/internal/recipes", {
    queryString: searchParams.toString(),
    errorMessage: "Gagal menghubungi Project Service",
  });
}
