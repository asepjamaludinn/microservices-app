import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaymentsPaginationProps {
  currentPage: number;
  totalPages: number;
  fetchPayments: (page: number) => void;
}

export default function PaymentsPagination({
  currentPage,
  totalPages,
  fetchPayments,
}: PaymentsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Informasi Halaman di Kiri */}
      <p className="text-sm text-slate-500 font-medium">
        Menampilkan halaman{" "}
        <span className="font-bold text-slate-900">{currentPage || 1}</span>{" "}
        dari <span className="font-bold text-slate-900">{totalPages || 1}</span>
      </p>

      {/* Kontrol Tombol di Kanan */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => fetchPayments(currentPage - 1)}
          className="h-9 px-3.5 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-40 disabled:bg-slate-50 shadow-sm"
        >
          <ChevronLeft size={16} className="mr-1.5 opacity-70" /> Prev
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => fetchPayments(currentPage + 1)}
          className="h-9 px-3.5 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-40 disabled:bg-slate-50 shadow-sm"
        >
          Next <ChevronRight size={16} className="ml-1.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
}
