import type { Menu } from "@/types/menu";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getPublicMenus() {
  const response = await safeJson<{ data: Menu[] | { data: Menu[] } }>(
    await fetch("/api/menus", {
      cache: "no-store",
    }),
  );

  return Array.isArray(response.data) ? response.data : response.data.data;
}
