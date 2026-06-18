"use client";

import Image from "next/image";
import { Utensils, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { usePublicMenus } from "@/hooks/use-public-menus";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuList() {
  const { menus, loading } = usePublicMenus();
  const { addToCart, setIsCartOpen } = useCartStore();

  return (
    <section id="menu" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Our Menu
        </h2>

        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Pilih dan nikmati hidangan terbaik kami yang disiapkan dengan bahan
          segar setiap harinya.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#c94430] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : menus.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-semibold">
          Belum ada menu yang tersedia saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group flex flex-col"
            >
              <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 mb-4">
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
                    <Utensils size={40} />
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#c94430]">
                  {menu.category?.name || "Menu"}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-[#c94430] transition-colors">
                  {menu.name}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {menu.description || "Hidangan lezat spesial untuk Anda."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <p className="text-xl font-black text-slate-900">
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </p>

                  <button
                    onClick={() => {
                      addToCart(menu);
                      setIsCartOpen(true);
                    }}
                    className="w-10 h-10 bg-[#c94430] text-white flex items-center justify-center rounded-xl hover:bg-[#b03a28] transition-transform active:scale-95"
                    aria-label={`Tambah ${menu.name} ke keranjang`}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
