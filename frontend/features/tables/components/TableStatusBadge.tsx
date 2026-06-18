import type { TableStatus } from "@/types/table";

export default function TableStatusBadge({ status }: { status: TableStatus }) {
  const classNameMap: Record<TableStatus, string> = {
    available: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    in_use: "bg-slate-100 text-slate-500 border border-slate-200",
    reserved: "bg-blue-50 text-blue-600 border border-blue-100",
    maintenance: "bg-orange-50 text-orange-600 border border-orange-100",
  };

  const labelMap: Record<TableStatus, string> = {
    available: "Available",
    in_use: "In Use",
    reserved: "Reserved",
    maintenance: "Maintenance",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${classNameMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}
