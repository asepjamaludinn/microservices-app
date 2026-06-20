import { Button } from "@/components/ui/button";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  fetchOrders: (page: number, search: string) => void;
}

export default function OrdersPagination({
  currentPage,
  totalPages,
  searchQuery,
  fetchOrders,
}: OrdersPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Button
        variant="outline"
        onClick={() => fetchOrders(currentPage - 1, searchQuery)}
        disabled={currentPage === 1}
        className="rounded-xl border-slate-200 bg-white"
      >
        Previous
      </Button>
      <span className="text-sm font-semibold text-slate-500">
        Halaman {currentPage} dari {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => fetchOrders(currentPage + 1, searchQuery)}
        disabled={currentPage === totalPages}
        className="rounded-xl border-slate-200 bg-white"
      >
        Next
      </Button>
    </div>
  );
}
