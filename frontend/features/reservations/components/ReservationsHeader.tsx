import { CalendarRange, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReservationsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenModal: () => void;
}

export default function ReservationsHeader({
  searchQuery,
  setSearchQuery,
  onOpenModal,
}: ReservationsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarRange className="text-[#c94430]" /> Reservasi Meja
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola pemesanan meja dan status kedatangan pelanggan.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#c94430]/20"
          />
        </div>
        <Button
          onClick={onOpenModal}
          className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl h-10 shrink-0"
        >
          <Plus size={18} className="md:mr-2" />
          <span className="hidden md:inline">Buat Reservasi</span>
        </Button>
      </div>
    </div>
  );
}
