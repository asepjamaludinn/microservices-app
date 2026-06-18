"use client";

import { History, Eye, X, FileJson, User, ActivitySquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditLogs, ENTITY_TYPES } from "@/hooks/use-audit-logs";
import { formatDateTime } from "@/utils/date-formatters";

export default function AuditLogsFeature() {
  const {
    logs,
    loading,
    entityType,
    setEntityType,
    currentPage,
    totalPages,
    handlePageChange,
    selectedLog,
    isModalOpen,
    openDetailModal,
    closeDetailModal,
  } = useAuditLogs();

  // Warna badge dinamis berdasarkan jenis action backend
  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATED"))
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (act.includes("UPDATED"))
      return "text-blue-600 bg-blue-50 border-blue-100";
    if (
      act.includes("DELETED") ||
      act.includes("CANCELLED") ||
      act.includes("REFUNDED")
    )
      return "text-red-600 bg-red-50 border-red-100";
    if (act.includes("DEDUCTED"))
      return "text-orange-600 bg-orange-50 border-orange-100";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="text-[#c94430]" /> Audit Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pantau seluruh aktivitas perubahan data di sistem restoran.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-slate-500">
            Filter Entitas:
          </p>
          <div className="w-[180px]">
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="Pilih Entitas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {ENTITY_TYPES.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="py-2.5 cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-slate-400 p-12">
            <ActivitySquare size={48} className="mb-3 opacity-30" />
            <p className="font-semibold text-lg">Log tidak ditemukan.</p>
            <p className="text-sm">
              Belum ada aktivitas yang terekam untuk filter ini.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Pengguna</th>
                    <th className="px-6 py-4">Aksi</th>
                    <th className="px-6 py-4">Entitas</th>
                    <th className="px-6 py-4">ID Target</th>
                    <th className="px-6 py-4 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-900">
                            {log.user?.name || `User ID: ${log.user_id}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getActionColor(log.action)}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">
                        {log.entity_type.split("\\").pop()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500">
                        #{log.entity_id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetailModal(log)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
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
            )}
          </>
        )}
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileJson size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                    Log Detail #{selectedLog.id}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {formatDateTime(selectedLog.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full transition-colors border border-slate-100 shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                  <p className="text-xs text-slate-400 font-semibold mb-1">
                    Aksi (Action)
                  </p>
                  <p
                    className={`font-bold uppercase text-[11px] w-max px-2 py-0.5 rounded border ${getActionColor(selectedLog.action)}`}
                  >
                    {selectedLog.action.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">
                    Target
                  </p>
                  <p className="font-bold text-slate-800">
                    {selectedLog.entity_type.split("\\").pop()}{" "}
                    <span className="text-slate-400">
                      #{selectedLog.entity_id}
                    </span>
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">
                    Pelaku
                  </p>
                  <p className="font-bold text-slate-800 line-clamp-1">
                    {selectedLog.user?.name ||
                      `User ID: ${selectedLog.user_id}`}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Detail
                  (JSON Payload)
                </h4>
                <div className="bg-slate-900 text-blue-300 p-4 rounded-2xl overflow-x-auto text-xs font-mono max-h-[300px] border border-slate-800 custom-scrollbar">
                  <pre>
                    {JSON.stringify(selectedLog.details || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
