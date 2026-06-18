import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/audit-logs", {
    queryString: searchParams.toString(),
    errorMessage: "Gagal memuat audit logs",
  });
}
