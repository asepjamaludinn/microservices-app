import type { Category } from "@/types/category";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }
  return data;
}

export async function getCategories() {
  const response = await safeJson<{ data: Category[] }>(
    await fetch("/api/categories", { cache: "no-store" }),
  );
  return response.data;
}

export async function createCategory(payload: { name: string; slug: string }) {
  return safeJson(
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateCategory(
  id: number,
  payload: { name: string; slug: string },
) {
  return safeJson(
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteCategory(id: number) {
  return safeJson(
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    }),
  );
}
