import Image from "next/image";
import { Edit2, Trash2, Utensils, Star, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/order-formatters";
import { cn } from "@/lib/utils";
import type { Menu } from "@/types/menu";

interface MenuCardProps {
  menu: Menu;
  onOpenRecipe: (menu: Menu) => void;
  onToggleAvailability: (menu: Menu) => void;
  onOpenEdit: (menu: Menu) => void;
  onOpenDelete: (menu: Menu) => void;
}

export default function MenuCard({
  menu,
  onOpenRecipe,
  onToggleAvailability,
  onOpenEdit,
  onOpenDelete,
}: MenuCardProps) {
  return (
    <div
      className={cn(
        "group cursor-pointer rounded-2xl border border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94430] transition-all",
        !menu.is_available && "opacity-60 grayscale-[50%]",
      )}
      onClick={() => onOpenRecipe(menu)}
    >
      <div className="relative h-44 overflow-hidden rounded-t-2xl bg-slate-100">
        {menu.image_url ? (
          <Image
            src={menu.image_url}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Utensils size={32} />
          </div>
        )}

        <div
          className={cn(
            "absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm",
            menu.is_available
              ? "bg-white/90 text-[#c94430]"
              : "bg-slate-800/90 text-white",
          )}
        >
          {menu.is_available ? "Tersedia" : "Sold Out"}
        </div>

        <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(menu);
            }}
            className={cn(
              "h-8 w-8 shadow-sm",
              menu.is_available
                ? "text-orange-600 hover:bg-orange-50"
                : "text-emerald-600 hover:bg-emerald-50",
            )}
          >
            {menu.is_available ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEdit(menu);
            }}
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 shadow-sm"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDelete(menu);
            }}
            className="h-8 w-8 text-red-600 hover:bg-red-50 shadow-sm"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-b-2xl">
        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#c94430] transition-colors">
          {menu.name}
        </h3>
        <p className="mt-0.5 text-xs font-semibold text-[#c94430]">
          {menu.category?.name || "Kategori"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={15} fill="currentColor" />
            <span className="ml-1 text-sm font-semibold text-slate-600">
              {menu.rating || "0.0"}
            </span>
          </div>
          <p className="font-bold text-slate-900">
            {formatCurrency(menu.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
