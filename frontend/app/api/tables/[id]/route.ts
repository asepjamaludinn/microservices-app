import { proxyRequest } from "@/lib/api-proxy";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return proxyRequest(`/api/tables/${id}`, {
    method: "DELETE",
    errorMessage: "Gagal menghapus meja",
  });
}
