import { User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/date-formatters";
import { getActionColor } from "../utils/audit-log-style";
import type { AuditLog } from "@/types/audit-log";

export const AuditLogsTableRow = ({
  log,
  onDetail,
}: {
  log: AuditLog;
  onDetail: (log: AuditLog) => void;
}) => (
  <tr className="hover:bg-slate-50/60 transition-colors">
    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
      {formatDateTime(log.created_at)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <User size={14} className="text-slate-400" />
        <span className="font-bold text-slate-900">
          {log.user_name || `User ID: ${log.user_id}`}
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
    <td className="px-6 py-4 font-semibold text-slate-500">#{log.entity_id}</td>
    <td className="px-6 py-4 text-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDetail(log)}
        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
      >
        <Eye size={16} />
      </Button>
    </td>
  </tr>
);
