import { proxyRequest } from "@/lib/api-proxy";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return proxyRequest(`/api/inventory/${id}`, {
    method: "PUT",
    body,
    errorMessage: "Gagal update bahan baku",
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return proxyRequest(`/api/inventory/${id}`, {
    method: "DELETE",
    errorMessage: "Gagal menghapus bahan baku",
  });
}
