"use client";

import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Utensils,
  Star,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Menu = {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  image_url?: string;
  rating?: string | number;
  category?: {
    name: string;
  };
};

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus/internal");
        const data = await res.json();
        if (res.ok) {
          setMenus(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Menu
          </h2>
          <p className="text-sm text-slate-500">
            Kelola katalog menu, harga, rating, dan resep internal.
          </p>
        </div>

        <Button className="rounded-xl bg-primary px-4 py-5 font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm">
          <Plus size={18} className="mr-2" />
          Tambah Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        {/* Filter Sidebar */}
        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Filter</h3>
            <SlidersHorizontal size={18} className="text-slate-400" />
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <h4 className="mb-3 font-semibold text-slate-700">Category</h4>
              <div className="space-y-3 text-slate-500">
                {[
                  "All",
                  "Chicken",
                  "Seafood",
                  "Pizza",
                  "Burger",
                  "Dessert",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      id={item}
                      defaultChecked={item === "All"}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="leading-none">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold text-slate-700">Rating</h4>
              <div className="space-y-3 text-slate-500">
                {[5, 4, 3, 2, 1].map((rate) => (
                  <label
                    key={rate}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <span className="flex items-center gap-1 text-yellow-400">
                      {"★".repeat(rate)}
                      <span className="text-slate-500 ml-1">{rate}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          {/* Search */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="text"
                placeholder="Search for menu"
                className="w-full rounded-xl border-slate-100 bg-slate-50 py-5 pl-10 pr-4 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
              />
            </div>

            <Button className="rounded-xl bg-primary px-6 py-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              Search
            </Button>
          </div>

          {/* Grid Menu */}
          {menus.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-slate-400">
              <Utensils size={36} />
              <p className="mt-3 font-medium">Belum ada menu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {menus.map((menu) => (
                <div key={menu.id} className="group cursor-pointer">
                  <div className="relative h-44 overflow-hidden rounded-2xl bg-slate-100">
                    {menu.image_url ? (
                      <img
                        src={menu.image_url}
                        alt={menu.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Utensils size={32} />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary">
                      Manageable
                    </div>

                    <div className="absolute right-3 top-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 shadow-sm"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                      {menu.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {menu.category?.name || "Main Course"}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={15} fill="currentColor" />
                        <span className="ml-1 text-sm font-semibold text-slate-600">
                          {menu.rating || "0.0"}
                        </span>
                      </div>

                      <p className="font-bold text-primary">
                        Rp {Number(menu.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
