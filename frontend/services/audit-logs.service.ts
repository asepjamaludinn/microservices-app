import type { AuditLog } from "@/types/audit-log";

type PaginatedAuditResponse = {
  status: string;
  message: string;
  data: {
    data: AuditLog[];
    meta: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }
  return data;
}

export async function getAuditLogs(page = 1, entityType = "All", search = "") {
  const params = new URLSearchParams({ page: page.toString() });

  if (entityType && entityType !== "All") {
    params.append("entity_type", entityType);
  }
  if (search) {
    params.append("search", search);
  }

  const res = await fetch(`/api/audit-logs?${params.toString()}`, {
    cache: "no-store",
  });
  const response = await safeJson<PaginatedAuditResponse>(res);
  const payload = response.data;

  return {
    logs: payload?.data || [],
    currentPage: payload?.meta?.current_page || 1,
    totalPages: payload?.meta?.last_page || 1,
  };
}
