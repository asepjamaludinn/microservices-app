import type { AnalyticsData, DashboardOrder } from "@/types/dashboard";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getDashboardAnalytics() {
  const response = await safeJson<{ data: AnalyticsData }>(
    await fetch("/api/analytics", {
      cache: "no-store",
    }),
  );

  return response.data;
}

export async function getRecentDashboardOrders(limit = 4) {
  const response = await safeJson<{
    data: DashboardOrder[] | { data: DashboardOrder[] };
  }>(
    await fetch("/api/orders", {
      cache: "no-store",
    }),
  );

  const orders = Array.isArray(response.data)
    ? response.data
    : response.data.data;

  return orders.slice(0, limit);
}
