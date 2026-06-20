import type { AuditLog } from "@/types/audit-log";
import { AuditLogsTableRow } from "./AuditLogsTableRow";

export const AuditLogsTable = ({
  logs,
  onDetail,
}: {
  logs: AuditLog[];
  onDetail: (log: AuditLog) => void;
}) => {
  return (
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
            <AuditLogsTableRow key={log.id} log={log} onDetail={onDetail} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
