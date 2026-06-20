"use client";

import { usePublicMenus } from "@/hooks/use-public-menus";

export default function StripeBanner() {
  const { menus, loading } = usePublicMenus();
  const topRatedMenus = [...menus]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 2);

  const menu1 = topRatedMenus[0];
  const menu2 = topRatedMenus[1];

  return (
    <section className="grid min-h-[520px] grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* Left */}
      <div className="relative bg-[#cf432f] px-8 py-16 text-black md:px-16 lg:px-20">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,#ffd48a_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="relative z-10">
          <h2 className="mb-12 max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl text-white">
            Yumminess On <br />
            The Brain
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Card 1 (Top 1 Menu) */}
            <div className="flex gap-5 rounded-2xl border-2 border-black bg-[#ffd49b] p-4 shadow-[6px_6px_0_#000] flex-col xl:flex-row">
              <img
                src={menu1?.image_url || "/images/placeholder-food.jpg"}
                alt={menu1?.name || "BiteBox favorite menu"}
                className="h-32 w-full xl:w-32 rounded-xl object-cover border-2 border-black/10"
              />

              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h3 className="text-xl font-black uppercase leading-tight line-clamp-2">
                    {menu1 ? menu1.name : "BiteBox Favorite"}
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-snug text-slate-800 line-clamp-2">
                    {menu1?.description ||
                      "Fresh dishes made for your best mood."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-black text-[#cf432f] flex items-center gap-1">
                    ★ {menu1?.rating || "4.9"}
                  </span>
                  <a
                    href="#menu"
                    className="w-max rounded-lg bg-[#cf432f] px-4 py-1.5 text-xs font-black text-white shadow-[0_4px_0_rgba(207,67,47,0.55)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-5 rounded-2xl border-2 border-black bg-[#ffd49b] p-4 shadow-[6px_6px_0_#000] flex-col xl:flex-row">
              <img
                src={menu2?.image_url || "/images/placeholder-food.jpg"}
                alt={menu2?.name || "BiteBox grill menu"}
                className="h-32 w-full xl:w-32 rounded-xl object-cover border-2 border-black/10"
              />

              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h3 className="text-xl font-black uppercase leading-tight line-clamp-2">
                    {menu2 ? menu2.name : "Fresh Meals"}
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-snug text-slate-800 line-clamp-2">
                    {menu2?.description || "Tasty, warm, and ready to enjoy."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-black text-[#cf432f] flex items-center gap-1">
                    ★ {menu2?.rating || "4.8"}
                  </span>
                  <a
                    href="#menu"
                    className="w-max rounded-lg bg-[#cf432f] px-4 py-1.5 text-xs font-black text-white shadow-[0_4px_0_rgba(207,67,47,0.55)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Menu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative bg-[#ffdc65] px-8 py-16 text-black md:px-16 lg:px-28">
        <div className="relative z-10 flex h-full flex-col justify-center">
          <h2 className="max-w-2xl text-5xl font-black uppercase leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl">
            You Can{" "}
            <span className="text-transparent [-webkit-text-stroke:1.5px_#000]">
              Feel
            </span>
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_#000]">
              The
            </span>{" "}
            Love From <br />
            Our Grill
          </h2>

          <p className="mt-16 max-w-2xl text-lg font-medium leading-relaxed">
            BiteBox is more than just a restaurant — it is a place where fresh
            flavors meet comfort food. Our menu is crafted for food lovers,
            families, and anyone who wants delicious meals fast.
          </p>
        </div>

        <div className="absolute bottom-6 right-[-60px] h-56 w-56 opacity-25">
          <div className="h-full w-full rounded-full border-[26px] border-[#fff4bc]" />
        </div>
      </div>
    </section>
  );
}
