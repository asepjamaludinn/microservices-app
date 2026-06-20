import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import POSMenuCard from "./POSMenuCard";
import POSMenuSkeleton from "./POSMenuSkeleton";
import type { Menu } from "@/types/menu";

interface POSMenuCatalogProps {
  menus: Menu[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (menu: Menu) => void;
}

export default function POSMenuCatalog({
  menus,
  loading,
  searchQuery,
  setSearchQuery,
  onAddToCart,
}: POSMenuCatalogProps) {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari pesanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] rounded-xl text-base"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <POSMenuSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {menus.map((menu) => (
              <POSMenuCard
                key={menu.id}
                menu={menu}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
