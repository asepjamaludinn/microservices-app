import type {
  Reservation,
  PaginatedReservationResponse,
} from "@/types/reservation";

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request gagal");
  return data;
}

export async function getReservations(page = 1, search = "") {
  const params = new URLSearchParams({ page: page.toString() });
  if (search) params.append("search", search);

  const res = await fetch(`/api/reservations?${params.toString()}`, {
    cache: "no-store",
  });
  const response = await safeJson<{ data: PaginatedReservationResponse }>(res);
  return {
    reservations: response.data.data,
    currentPage: response.data.current_page,
    totalPages: response.data.last_page,
  };
}

export async function createReservation(payload: any) {
  return safeJson(
    await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function processReservationAction(
  id: number,
  action: "confirm" | "complete" | "cancel",
) {
  return safeJson(
    await fetch(`/api/reservations/${id}/${action}`, {
      method: "PATCH",
    }),
  );
}
