"use client";

import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const AuditLogsPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-4 bg-slate-50/50">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-xl border-slate-200"
      >
        Prev
      </Button>
      <span className="text-sm font-semibold text-slate-500">
        Hal {currentPage} dari {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-xl border-slate-200"
      >
        Next
      </Button>
    </div>
  );
};
