import type { TableStatus } from "@/types/table";

export const getTableStatusTheme = (status: TableStatus) => {
  const classNameMap: Record<TableStatus, string> = {
    available: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    in_use: "bg-slate-100 text-slate-500 border border-slate-200",
    reserved: "bg-blue-50 text-blue-600 border border-blue-100",
    maintenance: "bg-orange-50 text-orange-600 border border-orange-100",
  };
  return classNameMap[status] || "bg-slate-100 text-slate-500 border-slate-200";
};

export const getTableStatusLabel = (status: TableStatus) => {
  const labelMap: Record<TableStatus, string> = {
    available: "Available",
    in_use: "In Use",
    reserved: "Reserved",
    maintenance: "Maintenance",
  };
  return labelMap[status] || "Unknown";
};
