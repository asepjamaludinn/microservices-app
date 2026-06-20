import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface POSTableSelectProps {
  tables: any[];
  tableNumber: string;
  setTableNumber: (val: string) => void;
  registerTableNumber: any;
  error?: string;
}

export default function POSTableSelect({
  tables,
  tableNumber,
  setTableNumber,
  registerTableNumber,
  error,
}: POSTableSelectProps) {
  return (
    <div>
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <MapPin size={18} className="text-slate-400 shrink-0" />
        <div className="relative w-full">
          <Select
            onValueChange={setTableNumber}
            value={tableNumber || undefined}
          >
            <SelectTrigger
              className={cn(
                "w-full h-10 rounded-xl px-3 bg-white focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] outline-none",
                error
                  ? "border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500"
                  : "border-slate-200",
                !tableNumber && "text-slate-500 font-normal",
              )}
            >
              <SelectValue placeholder="Pilih Meja Tersedia *" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {tables.length === 0 ? (
                <div className="p-3 text-sm text-center text-slate-500">
                  Tidak ada meja tersedia
                </div>
              ) : (
                tables.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.table_number.toString()}
                    className="py-2.5"
                  >
                    <span className="font-semibold text-slate-800">
                      Meja {t.table_number}
                    </span>
                    <span className="text-slate-500 ml-1">
                      - {t.area} ({t.capacity} Kursi)
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <input type="hidden" {...registerTableNumber} />
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1.5 ml-7">{error}</p>
      )}
    </div>
  );
}
