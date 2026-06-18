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
  X,
  Clock,
  Flame,
  Receipt,
  ChefHat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  pivot: {
    quantity: string | number;
  };
};

type Recipe = {
  id: number;
  prep_time: number;
  cook_time: number;
  instructions: string;
  cost_price: string | number;
  ingredients: Ingredient[];
};

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
  recipe?: Recipe;
};

const CATEGORIES = ["All", "Main Course", "Appetizer", "Dessert", "Beverage"];

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null); // State Baru untuk Rating

  // State untuk mengontrol Modal
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMenus = async (
    search = "",
    category = "All",
    rating: number | null = null,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);
      if (rating !== null) params.append("rating", rating.toString()); // Tambahkan Rating ke API

      const res = await fetch(`/api/menus/internal?${params.toString()}`);
      const responseData = await res.json();

      if (res.ok && responseData.data) {
        setMenus(responseData.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus(searchQuery, selectedCategory, selectedRating);
  }, [selectedCategory, selectedRating]); // Akan fetch ulang jika Kategori / Rating diklik

  const handleSearch = () => {
    fetchMenus(searchQuery, selectedCategory, selectedRating);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const openModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMenu(null), 200);
  };

  return (
    <div className="space-y-6 relative">
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

        <Button className="rounded-xl bg-[#c94430] px-4 py-5 font-semibold text-white hover:bg-[#b03a28] shadow-sm">
          <Plus size={18} className="mr-2" />
          Tambah Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        {/* Filter Sidebar */}
        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm h-fit">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Filter</h3>
            <SlidersHorizontal size={18} className="text-slate-400" />
          </div>

          <div className="space-y-6 text-sm">
            {/* Category Filter */}
            <div>
              <h4 className="mb-3 font-semibold text-slate-700">Category</h4>
              <div className="space-y-3 text-slate-500">
                {CATEGORIES.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <Checkbox
                      id={item}
                      checked={selectedCategory === item}
                      onCheckedChange={() => setSelectedCategory(item)}
                      className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                    />
                    <span className="leading-none">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter (DIKEMBALIKAN) */}
            <div>
              <h4 className="mb-3 font-semibold text-slate-700">
                Minimum Rating
              </h4>
              <div className="space-y-3 text-slate-500">
                {[5, 4, 3, 2, 1].map((rate) => (
                  <label
                    key={rate}
                    className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <Checkbox
                      checked={selectedRating === rate}
                      onCheckedChange={(checked) =>
                        setSelectedRating(checked ? rate : null)
                      } // Jika uncheck, kembali ke null (semua rating)
                      className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                    />
                    <span className="flex items-center gap-1 text-yellow-400">
                      {"★".repeat(rate)}
                      <span className="text-slate-500 ml-1">{rate} & up</span>
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
                placeholder="Cari nama menu (Tekan Enter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border-slate-200 bg-slate-50 py-5 pl-10 pr-4 text-sm focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430]"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="rounded-xl bg-[#c94430] px-6 py-5 text-sm font-semibold text-white hover:bg-[#b03a28]"
            >
              Search
            </Button>
          </div>

          {/* Grid Menu */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
            </div>
          ) : menus.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-slate-400">
              <Utensils size={36} />
              <p className="mt-3 font-medium">Belum ada menu yang cocok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="group cursor-pointer"
                  onClick={() => openModal(menu)}
                >
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

                    <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#c94430] shadow-sm backdrop-blur-sm">
                      Manageable
                    </div>

                    <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Fitur Edit Menu ID: ${menu.id}`);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Fitur Hapus Menu ID: ${menu.id}`);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3">
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

      {/* MODAL POP-UP RAHASIA DAPUR */}
      {isModalOpen && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c94430]/10 flex items-center justify-center text-[#c94430]">
                  <ChefHat size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                    Rahasia Dapur (Internal)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedMenu.name}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {selectedMenu.recipe ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Kolom Kiri: Stats & Bahan */}
                  <div className="space-y-6">
                    {/* Stats Box */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <Clock className="text-orange-500 mb-2" size={20} />
                        <p className="text-xs text-orange-600/80 font-semibold mb-0.5">
                          Waktu Persiapan
                        </p>
                        <p className="font-bold text-orange-700">
                          {selectedMenu.recipe.prep_time} Menit
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                        <Flame className="text-red-500 mb-2" size={20} />
                        <p className="text-xs text-red-600/80 font-semibold mb-0.5">
                          Waktu Memasak
                        </p>
                        <p className="font-bold text-red-700">
                          {selectedMenu.recipe.cook_time} Menit
                        </p>
                      </div>
                      <div className="col-span-2 bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-600/80 font-semibold mb-0.5 flex items-center gap-1">
                            <Receipt size={14} /> Modal / HPP
                          </p>
                          <p className="font-bold text-emerald-700 text-lg">
                            Rp{" "}
                            {Number(
                              selectedMenu.recipe.cost_price,
                            ).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600/80 font-semibold mb-0.5">
                            Harga Jual
                          </p>
                          <p className="font-bold text-slate-700">
                            Rp{" "}
                            {Number(selectedMenu.price).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients List */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        Komposisi Bahan
                      </h4>
                      <ul className="space-y-2">
                        {selectedMenu.recipe.ingredients?.map((ing) => (
                          <li
                            key={ing.id}
                            className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm"
                          >
                            <span className="font-medium text-slate-700">
                              {ing.name}
                            </span>
                            <span className="font-bold text-[#c94430] bg-[#c94430]/10 px-2 py-1 rounded-md text-xs">
                              {Number(ing.pivot.quantity)} {ing.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Kolom Kanan: Instruksi Memasak */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">
                      Langkah Memasak (SOP)
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {selectedMenu.recipe.instructions}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-bold text-slate-900 mb-3">
                        Deskripsi Menu Publik
                      </h4>
                      <p className="text-sm text-slate-500 italic">
                        "{selectedMenu.description}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <ChefHat size={48} className="mb-4 opacity-50" />
                  <p className="font-medium text-slate-600">
                    Belum ada resep internal untuk menu ini.
                  </p>
                  <Button className="mt-4 bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl">
                    <Plus size={16} className="mr-2" /> Buat Resep Baru
                  </Button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="rounded-xl font-semibold border-slate-200"
              >
                Tutup
              </Button>
              <Button className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl font-semibold">
                <Edit2 size={16} className="mr-2" /> Edit Resep
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
