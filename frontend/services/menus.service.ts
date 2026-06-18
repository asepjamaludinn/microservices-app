import type { Menu } from "@/types/menu";

export type MenuQuery = {
  search?: string;
  category?: string;
  rating?: number | null;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request gagal");
  return data;
}

export async function getMenus(query: MenuQuery = {}) {
  const params = new URLSearchParams();
  if (query.search) params.append("search", query.search);
  if (query.category && query.category !== "All")
    params.append("category", query.category);
  if (query.rating !== null && query.rating !== undefined)
    params.append("rating", query.rating.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/menus/internal?${queryString}`
    : "/api/menus/internal";

  const response = await safeJson<ApiResponse<Menu[]>>(
    await fetch(url, { cache: "no-store" }),
  );
  return response.data;
}

export async function getInternalMenus() {
  return getMenus({});
}

export async function getCategoriesList() {
  const response = await safeJson<
    ApiResponse<{ id: number; name: string; slug: string }[]>
  >(await fetch("/api/categories", { cache: "no-store" }));
  return response.data;
}

export async function createMenu(payload: Partial<Menu>) {
  return safeJson(
    await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateMenu(id: number, payload: Partial<Menu>) {
  return safeJson(
    await fetch(`/api/menus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteMenu(id: number) {
  return safeJson(await fetch(`/api/menus/${id}`, { method: "DELETE" }));
}

export async function toggleMenuAvailability(id: number) {
  return safeJson(await fetch(`/api/menus/${id}/status`, { method: "PATCH" }));
}
