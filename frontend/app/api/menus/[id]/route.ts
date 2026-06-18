import { proxyRequest } from "@/lib/api-proxy";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return proxyRequest(`/api/menus/${id}`, {
    method: "PUT",
    body,
    errorMessage: "Gagal update menu",
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return proxyRequest(`/api/menus/${id}`, {
    method: "DELETE",
    errorMessage: "Gagal menghapus menu",
  });
}
