import { Utensils } from "lucide-react";
import MenusGridSkeleton from "./MenusGridSkeleton";
import MenuCard from "./MenuCard";
import MenusToolbar from "./MenusToolbar";
import type { Menu } from "@/types/menu";

interface MenusGridProps {
  menus: Menu[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onOpenRecipe: (menu: Menu) => void;
  onToggleAvailability: (menu: Menu) => void;
  onOpenEdit: (menu: Menu) => void;
  onOpenDelete: (menu: Menu) => void;
}

export default function MenusGrid({
  menus,
  loading,
  searchQuery,
  setSearchQuery,
  handleKeyDown,
  handleSearch,
  onOpenRecipe,
  onToggleAvailability,
  onOpenEdit,
  onOpenDelete,
}: MenusGridProps) {
  return (
    <main className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <MenusToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
      />

      {loading ? (
        <MenusGridSkeleton />
      ) : menus.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-slate-400">
          <Utensils size={36} />
          <p className="mt-3 font-medium">Belum ada menu yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onOpenRecipe={onOpenRecipe}
              onToggleAvailability={onToggleAvailability}
              onOpenEdit={onOpenEdit}
              onOpenDelete={onOpenDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
