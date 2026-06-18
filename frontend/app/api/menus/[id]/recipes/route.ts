import { proxyRequest } from "@/lib/api-proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return proxyRequest(`/api/menus/${id}/recipes`, {
    method: "POST",
    body,
    errorMessage: "Gagal membuat resep",
  });
}
