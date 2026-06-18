import { proxyRequest } from "@/lib/api-proxy";

export async function GET() {
  return proxyRequest("/api/ingredients", {
    errorMessage: "Gagal mengambil data bahan baku",
  });
}
