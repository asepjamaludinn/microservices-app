import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaymentsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  perPage?: number;
  fetchPayments: (page: number) => void;
}

export default function PaymentsPagination({
  currentPage,
  totalPages,
  totalItems = 0,
  perPage = 10,
  fetchPayments,
}: PaymentsPaginationProps) {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Number(currentPage) || 1;
  const safeTotalPages = Number(totalPages) || 1;

  const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div className="border-t border-slate-100 bg-white px-6 py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>Showing</span>

          <div className="flex h-11 min-w-[68px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm">
            {perPage}
          </div>

          <span>
            out of{" "}
            <span className="font-semibold text-slate-700">
              {totalItems.toLocaleString()}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => fetchPayments(safeCurrentPage - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          {pages.map((page) => {
            const isActive = safeCurrentPage === page;

            return (
              <button
                type="button"
                key={`payment-page-${page}`}
                onClick={() => fetchPayments(page)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "border border-slate-100 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
                }`}
              >
                <span>{page}</span>
              </button>
            );
          })}

          <button
            type="button"
            disabled={safeCurrentPage === safeTotalPages}
            onClick={() => fetchPayments(safeCurrentPage + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
