import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "../constants/table-options";
import type { TableStatus } from "@/types/table";

interface TablesToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: TableStatus | "all_statuses") => void;
  filterArea: string;
  setFilterArea: (val: string) => void;
  uniqueAreas: string[];
  openAddModal: () => void;
}

export default function TablesToolbar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterArea,
  setFilterArea,
  uniqueAreas,
  openAddModal,
}: TablesToolbarProps) {
  return (
    <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
      <div className="flex gap-2"></div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari meja, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-white border-slate-200 min-w-[200px]"
          />
        </div>

        <div className="w-[160px]">
          <Select
            value={filterStatus}
            onValueChange={(v) =>
              setFilterStatus(v as TableStatus | "all_statuses")
            }
          >
            <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white shadow-xl z-50">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="py-2.5 cursor-pointer focus:bg-slate-50"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[160px]">
          <Select value={filterArea} onValueChange={(v) => setFilterArea(v)}>
            <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white shadow-xl z-50">
              <SelectItem
                value="All Areas"
                className="py-2.5 cursor-pointer focus:bg-slate-50"
              >
                All Areas
              </SelectItem>
              {uniqueAreas.map((area) => (
                <SelectItem
                  key={area}
                  value={area}
                  className="py-2.5 cursor-pointer focus:bg-slate-50"
                >
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={openAddModal}
          className="rounded-xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold shadow-sm h-10"
        >
          <Plus size={16} className="mr-2" /> Add Table
        </Button>
      </div>
    </div>
  );
}
