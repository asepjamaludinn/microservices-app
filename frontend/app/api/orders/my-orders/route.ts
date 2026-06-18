import { proxyRequest } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return proxyRequest("/api/my-orders", {
    queryString: searchParams.toString(),
    errorMessage: "Gagal mengambil riwayat pesanan",
  });
}
