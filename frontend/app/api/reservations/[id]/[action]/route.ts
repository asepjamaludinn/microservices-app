import { proxyRequest } from "@/lib/api-proxy";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string; action: string }> },
) {
  const { id, action } = await params;

  return proxyRequest(`/api/reservations/${id}/${action}`, {
    method: "PATCH",
    errorMessage: `Gagal memproses ${action}`,
  });
}
