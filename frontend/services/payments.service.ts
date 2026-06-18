import type { Payment, PaginatedPaymentResponse } from "@/types/payment";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request gagal");
  return data;
}

export async function getPayments(page = 1) {
  const res = await fetch(`/api/payments?page=${page}`, { cache: "no-store" });
  const response = await safeJson<{ data: PaginatedPaymentResponse }>(res);
  return {
    payments: response.data.data,
    currentPage: response.data.current_page,
    totalPages: response.data.last_page,
  };
}

export async function refundPayment(id: number) {
  return safeJson(
    await fetch(`/api/payments/${id}/refund`, {
      method: "POST",
    }),
  );
}
