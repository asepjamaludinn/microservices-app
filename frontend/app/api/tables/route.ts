import { proxyRequest } from "@/lib/api-proxy";

export async function GET() {
  return proxyRequest("/api/tables", {
    errorMessage: "Gagal memuat data meja",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return proxyRequest("/api/tables", {
    method: "POST",
    body,
    errorMessage: "Gagal membuat meja",
  });
}
