import Image from "next/image";
import { Utensils } from "lucide-react";
import type { Menu } from "@/types/menu";

interface POSMenuCardProps {
  menu: Menu;
  onAddToCart: (menu: Menu) => void;
}

export default function POSMenuCard({ menu, onAddToCart }: POSMenuCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAddToCart(menu);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onAddToCart(menu)}
      onKeyDown={handleKeyDown}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-[#c94430]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94430] transition-all group flex flex-col"
    >
      <div className="h-32 bg-slate-100 relative overflow-hidden">
        {menu.image_url ? (
          <Image
            src={menu.image_url}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Utensils size={24} />
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-[#c94430] font-semibold mb-1 truncate">
            {menu.category?.name}
          </p>
          <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
            {menu.name}
          </h3>
        </div>
        <p className="text-sm font-bold text-slate-900 mt-3">
          Rp {Number(menu.price).toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}
