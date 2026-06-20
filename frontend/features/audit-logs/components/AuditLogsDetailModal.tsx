"use client";

import { X, FileJson } from "lucide-react";
import { formatDateTime } from "@/utils/date-formatters";
import { getActionColor } from "../utils/audit-log-style";
import type { AuditLog } from "@/types/audit-log";

interface Props {
  selectedLog: AuditLog | null;
  isModalOpen: boolean;
  closeDetailModal: () => void;
}

export const AuditLogsDetailModal = ({
  selectedLog,
  isModalOpen,
  closeDetailModal,
}: Props) => {
  if (!isModalOpen || !selectedLog) return null;

  return (
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
            className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full border border-slate-100"
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
                <span className="text-slate-400">#{selectedLog.entity_id}</span>
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">
                Pelaku
              </p>
              <p className="font-bold text-slate-800 line-clamp-1">
                {selectedLog.user_name || `User ID: ${selectedLog.user_id}`}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              Detail (JSON Payload)
            </h4>
            <div className="bg-slate-900 text-blue-300 p-4 rounded-2xl overflow-x-auto text-xs font-mono max-h-[300px] border border-slate-800">
              <pre>{JSON.stringify(selectedLog.details || {}, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
