import { proxyRequest } from "@/lib/api-proxy";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return proxyRequest(`/api/menus/${id}/status`, {
    method: "PATCH",
    errorMessage: "Gagal update status ketersediaan",
  });
}
