import { proxyRequest } from "@/lib/api-proxy";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json();
  const { id } = await params;

  return proxyRequest(`/api/categories/${id}`, {
    method: "PUT",
    body,
    errorMessage: "Gagal update kategori",
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return proxyRequest(`/api/categories/${id}`, {
    method: "DELETE",
    errorMessage: "Gagal menghapus kategori",
  });
}
