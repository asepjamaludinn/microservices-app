"use client";

import { History, ActivitySquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { AuditLogsFilters } from "./AuditLogsFilters";
import { AuditLogsTable } from "./AuditLogsTable";
import { AuditLogsDetailModal } from "./AuditLogsDetailModal";
import { AuditLogsPagination } from "./AuditLogsPagination";

export default function AuditLogsFeature() {
  const hooks = useAuditLogs();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="text-[#c94430]" /> Audit Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pantau seluruh aktivitas perubahan data di sistem restoran.
          </p>
        </div>
        <AuditLogsFilters {...hooks} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {hooks.loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : hooks.logs.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-slate-400 p-12">
            <ActivitySquare size={48} className="mb-3 opacity-30" />
            <p className="font-semibold text-lg">Log tidak ditemukan.</p>
            <p className="text-sm">Belum ada aktivitas yang terekam.</p>
          </div>
        ) : (
          <>
            <AuditLogsTable
              logs={hooks.logs}
              onDetail={hooks.openDetailModal}
            />
            <AuditLogsPagination {...hooks} />
          </>
        )}
      </div>

      <AuditLogsDetailModal {...hooks} />
    </div>
  );
}
