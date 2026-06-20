import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openIngredientModal: () => void;
}

export default function InventoryHeader({
  searchQuery,
  setSearchQuery,
  openIngredientModal,
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Inventory Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Lacak dan kelola stok bahan baku restoran.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari bahan baku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-[#c94430]/20"
          />
        </div>
        <Button
          onClick={() => openIngredientModal()}
          className="rounded-xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold h-10 shrink-0"
        >
          <Plus size={16} className="mr-2" /> Tambah Bahan
        </Button>
      </div>
    </div>
  );
}
