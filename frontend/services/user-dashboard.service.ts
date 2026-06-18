import type { Order } from "@/types/order";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getMyOrders() {
  const response = await safeJson<{ data: Order[] | { data: Order[] } }>(
    await fetch("/api/orders/my-orders"),
  );

  return Array.isArray(response.data) ? response.data : response.data.data;
}
