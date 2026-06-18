import type { Order, OrderStatus, PaginatedOrderResponse } from "@/types/order";

export type CreateOrderPayload = {
  customer_name: string;
  order_type: "dine_in" | "takeaway";
  table_number: string | null;
  payment_method: "cash" | "qris" | "card";
  items: {
    menu_id: number;
    quantity: number;
    notes: string | null;
  }[];
};

type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function getOrders(page = 1, perPage = 20, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (search) {
    params.append("search", search);
  }

  const res = await fetch(`/api/orders?${params.toString()}`, {
    cache: "no-store",
  });

  const response =
    await safeJson<ApiResponse<Order[] | PaginatedOrderResponse>>(res);

  const payload = response.data;

  if (Array.isArray(payload)) {
    return {
      orders: payload,
      currentPage: page,
      totalPages: 1,
    };
  }

  return {
    orders: payload.data,
    currentPage: payload.current_page,
    totalPages: payload.last_page,
  };
}

export async function createOrder(payload: CreateOrderPayload) {
  return safeJson<ApiResponse<Order>>(
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return safeJson(res);
}

export async function payOrderBill(orderId: number) {
  const res = await fetch(`/api/orders/${orderId}/payment-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payment_status: "paid" }),
  });

  return safeJson(res);
}
