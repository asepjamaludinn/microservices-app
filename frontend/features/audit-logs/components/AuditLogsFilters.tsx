import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENTITY_TYPES } from "@/hooks/use-audit-logs";

export const AuditLogsFilters = ({
  searchQuery,
  setSearchQuery,
  entityType,
  setEntityType,
}: any) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
    <div className="relative w-full sm:w-64">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <Input
        placeholder="Cari user atau aksi..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200"
      />
    </div>
    <div className="w-full sm:w-[150px]">
      <Select value={entityType} onValueChange={setEntityType}>
        <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl">
          <SelectValue placeholder="Entitas" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {ENTITY_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);
