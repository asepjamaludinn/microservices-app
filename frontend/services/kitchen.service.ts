import type { Order, OrderStatus } from "@/types/order";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getKitchenOrders() {
  const response = await safeJson<{ data: Order[] | { data: Order[] } }>(
    await fetch("/api/orders?paginate=false", {
      cache: "no-store",
    }),
  );

  const orders = Array.isArray(response.data)
    ? response.data
    : response.data.data;

  return orders
    .filter((order) => order.status === "pending" || order.status === "cooking")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
}

export async function updateKitchenOrderStatus(
  orderId: number,
  status: Extract<OrderStatus, "cooking" | "ready">,
) {
  return safeJson(
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }),
  );
}
