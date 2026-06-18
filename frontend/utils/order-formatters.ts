import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

export const ORDER_TABS = [
  "All",
  "On Process",
  "Completed",
  "Canceled",
] as const;

export type OrderTab = (typeof ORDER_TABS)[number];

export function formatCurrency(value: string | number) {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export function formatOrderNumber(orderId: number) {
  return `#ORD${orderId.toString().padStart(4, "0")}`;
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function filterOrdersByTab(orders: Order[], activeTab: OrderTab) {
  if (activeTab === "All") return orders;

  if (activeTab === "On Process") {
    return orders.filter((order) =>
      ["pending", "cooking", "ready"].includes(order.status),
    );
  }

  if (activeTab === "Completed") {
    return orders.filter((order) => order.status === "completed");
  }

  if (activeTab === "Canceled") {
    return orders.filter((order) => order.status === "cancelled");
  }

  return orders;
}

export function getStatusLabel(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    completed: "Completed",
    cancelled: "Cancelled",
    ready: "Ready to Serve",
    cooking: "Cooking",
    pending: "Pending",
  };

  return map[status];
}

export function getPaymentLabel(status: PaymentStatus) {
  const map: Record<PaymentStatus, string> = {
    paid: "PAID",
    refunded: "REFUNDED",
    unpaid: "UNPAID",
  };

  return map[status];
}
