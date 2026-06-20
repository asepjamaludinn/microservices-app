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
            className="mt-2 inline-flex h-16 items-center justify-center rounded-xl bg-[#fff4dc] px-10 text-sm font-black uppercase text-[#cf432f] shadow-[0_8px_0_rgba(255,244,220,0.55)] transition hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(255,244,220,0.45)]"
          >
            Get Started
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#fff4dc] border-t-transparent" />
          </div>
        ) : menus.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#fff4dc]/70 bg-white/10 p-12 text-center font-bold text-[#fff4dc]">
            Belum ada menu yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((menu, index) => (
              <article
                key={menu.id}
                className={`group relative rounded-[2rem] border border-dashed border-[#fff4dc]/80 p-5 transition duration-300 hover:-translate-y-2 hover:bg-white/10 ${
                  index % 3 === 1 ? "xl:-mt-8" : ""
                }`}
              >
                <div className="relative h-[300px] overflow-hidden rounded-3xl bg-black/20 shadow-2xl">
                  {menu.image_url ? (
                    <Image
                      src={menu.image_url}
                      alt={menu.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#fff4dc]/60">
                      <Utensils size={56} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(menu);
                      setIsCartOpen(true);
                    }}
                    className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff4dc]/80 text-sm font-black uppercase text-[#cf432f] opacity-0 shadow-2xl backdrop-blur-md transition duration-300 group-hover:opacity-100"
                  >
                    View
                  </button>

                  <div className="absolute left-5 top-5 rounded-full bg-[#fff4dc] px-4 py-2 text-xs font-black uppercase text-[#cf432f]">
                    {menu.category?.name || "Menu"}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(menu);
                      setIsCartOpen(true);
                    }}
                    className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#cf432f] text-white shadow-lg transition hover:scale-110"
                    aria-label={`Tambah ${menu.name} ke keranjang`}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="mb-2 text-2xl font-black leading-tight text-white">
                      {menu.name}
                    </h3>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-[#ffb000]">
                        <Star size={16} className="fill-[#ffb000]" />
                        <span className="text-sm font-bold text-white">
                          {Number(menu.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-900">
                        Rp {Number(menu.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 line-clamp-2 text-sm font-semibold leading-relaxed text-[#ffe9b7]/85">
                  {menu.description || "Hidangan lezat spesial untuk Anda."}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
