import { Ingredient } from "@/types";

export const getInventory = async (): Promise<Ingredient[]> => {
  const res = await fetch("/api/inventory");
  if (!res.ok) throw new Error("Gagal mengambil inventory");
  const data = await res.json();
  return data.data;
};

export const updateStock = async (
  id: number,
  type: "in" | "out",
  amount: number,
  reason?: string,
) => {
  const res = await fetch(`/api/inventory/${id}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, amount, reason }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal update stok");
  }
  return res.json();
};

export const createIngredient = async (payload: {
  name: string;
  unit: string;
  stock?: number;
}) => {
  const res = await fetch("/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal menambah bahan baku");
  }
  return res.json();
};

export const updateIngredient = async (
  id: number,
  payload: { name: string; unit: string },
) => {
  const res = await fetch(`/api/inventory/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal update bahan baku");
  }
  return res.json();
};

export const deleteIngredient = async (id: number) => {
  const res = await fetch(`/api/inventory/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal menghapus bahan baku");
  }
  return res.json();
};
