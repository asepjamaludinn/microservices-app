import { Banknote, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaymentsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function PaymentsHeader({
  searchQuery,
  setSearchQuery,
}: PaymentsHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Banknote className="text-[#c94430]" /> Riwayat Pembayaran
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Lacak semua transaksi pembayaran dan struk yang telah dicetak.
        </p>
      </div>

      <div className="relative w-full md:w-72">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Cari no. struk / nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#c94430]/20"
        />
      </div>
    </div>
  );
}
