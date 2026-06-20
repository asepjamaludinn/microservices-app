import {
  MoreHorizontal,
  Check,
  Armchair,
  Calendar,
  Wrench,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableStatus } from "@/types/table";

interface TableActionsDropdownProps {
  tableId: number;
  tableNumber: string;
  changeStatus: (id: number, status: TableStatus) => void;
  handleDelete: (id: number, number: string) => void;
}

export default function TableActionsDropdown({
  tableId,
  tableNumber,
  changeStatus,
  handleDelete,
}: TableActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        >
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white rounded-2xl shadow-xl p-2 border-slate-100 z-50"
      >
        <DropdownMenuItem
          onClick={() => changeStatus(tableId, "available")}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
        >
          <Check size={16} /> Set Available
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeStatus(tableId, "in_use")}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 focus:bg-slate-50 focus:text-slate-900 cursor-pointer transition-colors"
        >
          <Armchair size={16} /> Set In Use
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeStatus(tableId, "reserved")}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-blue-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer transition-colors"
        >
          <Calendar size={16} /> Set Reserved
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeStatus(tableId, "maintenance")}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-600 focus:bg-orange-50 focus:text-orange-700 cursor-pointer transition-colors"
        >
          <Wrench size={16} /> Set Maintenance
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-slate-100" />

        <DropdownMenuItem
          onClick={() => handleDelete(tableId, tableNumber)}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer transition-colors"
        >
          <Trash2 size={16} /> Hapus Meja
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
