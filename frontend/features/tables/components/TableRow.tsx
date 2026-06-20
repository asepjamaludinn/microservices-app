import { Armchair, Wine, Calendar as CalendarIcon } from "lucide-react";
import { formatDateTime } from "@/utils/date-formatters";
import TableStatusBadge from "./TableStatusBadge";
import TableActionsDropdown from "./TableActionsDropdown";
import type { TableStatus } from "@/types/table";

interface TableRowProps {
  table: any;
  changeStatus: (id: number, status: TableStatus) => void;
  handleDelete: (id: number, number: string) => void;
}

export default function TableRow({
  table,
  changeStatus,
  handleDelete,
}: TableRowProps) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c94430]/10 text-[#c94430] flex items-center justify-center">
            <Armchair size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">
              Table {table.table_number}
            </p>
            <p className="text-xs text-slate-400">{table.name || "No label"}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Wine size={16} className="text-slate-400" />
          {table.area}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-bold text-slate-900">{table.capacity}</span>{" "}
        <span className="text-slate-400">seats</span>
      </td>
      <td className="px-6 py-4">
        <TableStatusBadge status={table.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarIcon size={13} />
            {formatDateTime(table.updated_at)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right relative">
        <TableActionsDropdown
          tableId={table.id}
          tableNumber={table.table_number.toString()}
          changeStatus={changeStatus}
          handleDelete={handleDelete}
        />
      </td>
    </tr>
  );
}
