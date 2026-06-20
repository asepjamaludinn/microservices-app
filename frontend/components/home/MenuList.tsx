"use client";

import Image from "next/image";
import { Plus, Star, Utensils } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { usePublicMenus } from "@/hooks/use-public-menus";

export default function MenuList() {
  const { menus, loading } = usePublicMenus();
  const { addToCart, setIsCartOpen } = useCartStore();

  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[#cf432f] px-6 py-24 text-[#fff4dc]"
    >
      <div className="pointer-events-none absolute inset-0 text-[13rem] font-black uppercase leading-none tracking-tighter text-white/5 md:text-[18rem]">
        Food Menu
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#ffe9b7]/80">
              BiteBox Special
            </p>

            <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#fff4dc] md:text-7xl lg:text-8xl">
              Protein Foods To Support You
            </h2>
          </div>

          <a
            href="#menu"
            className="mt-2 inline-flex h-16 items-center justify-center rounded-xl bg-[#fff4dc] px-10 text-sm font-black uppercase text-[#cf432f] shadow-[0_8px_0_rgba(255,244,220,0.55)] transition hover:-translate-y-1"
          >
            Get Started
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#fff4dc] border-t-transparent" />
          </div>
        ) : menus.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#fff4dc]/70 bg-white/10 p-12 text-center font-bold">
            Belum ada menu yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((menu) => (
              <article key={menu.id} className="group">
                {/* IMAGE CARD */}
                <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-[#fff4dc]/85 p-4">
                  <div className="relative h-[355px] w-full overflow-hidden rounded-[1.5rem] bg-black/20">
                    {menu.image_url ? (
                      <Image
                        src={menu.image_url}
                        alt={menu.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#fff4dc]/60">
                        <Utensils size={56} />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(menu);
                        setIsCartOpen(true);
                      }}
                      className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#cf432f] text-white shadow-lg transition hover:scale-110"
                      aria-label={`Tambah ${menu.name} ke keranjang`}
                    >
                      <Plus size={22} strokeWidth={3} />
                    </button>

                    <div className="absolute left-5 top-5 rounded-full bg-[#fff4dc] px-4 py-2 text-xs font-black uppercase text-[#cf432f]">
                      {menu.category?.name || "Menu"}
                    </div>
                  </div>
                </div>

                {/* CONTENT OUTSIDE CARD */}
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight text-[#fff4dc]">
                      {menu.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-[#ffe9b7]">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-semibold">4.9 Rating</span>
                    </div>
                  </div>

                  <div className="rounded-full border border-[#fff4dc]/40 px-4 py-2">
                    <p className="text-lg font-black text-[#fff4dc]">
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
