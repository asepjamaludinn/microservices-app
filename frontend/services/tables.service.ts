import type { RestaurantTable, TableStatus } from "@/types/table";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getTables() {
  const response = await safeJson<{ data: RestaurantTable[] }>(
    await fetch("/api/tables", {
      cache: "no-store",
    }),
  );

  return response.data;
}

export async function updateTableStatus(id: number, status: TableStatus) {
  return safeJson(
    await fetch(`/api/tables/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }),
  );
}

export async function createTable(payload: {
  table_number: string;
  name: string;
  area: string;
  capacity: number;
  status: TableStatus;
}) {
  return safeJson(
    await fetch("/api/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteTable(id: number) {
  return safeJson(
    await fetch(`/api/tables/${id}`, {
      method: "DELETE",
    }),
  );
}
