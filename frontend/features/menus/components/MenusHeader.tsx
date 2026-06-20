import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenusHeaderProps {
  openAddForm: () => void;
}

export default function MenusHeader({ openAddForm }: MenusHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Manajemen Menu
        </h2>
        <p className="text-sm text-slate-500">
          Kelola katalog menu, harga, rating, dan ketersediaan.
        </p>
      </div>
      <Button
        onClick={openAddForm}
        className="rounded-xl bg-[#c94430] px-4 py-5 font-semibold text-white hover:bg-[#b03a28] shadow-sm"
      >
        <Plus size={18} className="mr-2" /> Tambah Menu
      </Button>
    </div>
  );
}
