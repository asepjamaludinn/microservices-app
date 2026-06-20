import type { PaginatedReviewResponse } from "@/types/review";

type CreateReviewPayload = {
  order_id?: number | null;
  menu_id?: number | null;
  customer_name: string;
  rating: number;
  comment: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request gagal");
  return data;
}

export async function getReviews(page = 1, search = "") {
  const params = new URLSearchParams({ page: page.toString() });
  if (search) params.append("search", search);

  const res = await fetch(`/api/reviews?${params.toString()}`, {
    cache: "no-store",
  });
  const response = await safeJson<{ data: PaginatedReviewResponse }>(res);

  return {
    reviews: response.data.data,
    currentPage: response.data.current_page,
    totalPages: response.data.last_page,
    totalItems: response.data.total || 0,
    perPage: response.data.per_page || 10,
  };
}

export async function createReview(payload: CreateReviewPayload) {
  return safeJson(
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}
