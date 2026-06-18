"use client";

import { useState } from "react";
import Image from "next/image";
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
  EyeOff,
  Eye,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMenus } from "@/hooks/use-menus";
import { formatCurrency } from "@/utils/order-formatters";
import { cn } from "@/lib/utils";
import type { Menu } from "@/types/menu";

export default function MenusFeature() {
  const {
    menus,
    categories,
    ingredients,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRating,
    setSelectedRating,
    selectedMenu,
    isRecipeModalOpen,
    handleSearch,
    handleKeyDown,
    openRecipeModal,
    closeRecipeModal,
    addMenu,
    editMenu,
    removeMenu,
    toggleAvailability,
    addRecipe,
  } = useMenus();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [menuToEditOrDelete, setMenuToEditOrDelete] = useState<Menu | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    description: "",
    image_url: "",
  });

  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [recipeForm, setRecipeForm] = useState({
    prep_time: "",
    cook_time: "",
    cost_price: "",
    instructions: "",
    recipe_ingredients: [{ id: "", quantity: "" }],
  });

  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      name: "",
      category_id: "",
      price: "",
      description: "",
      image_url: "",
    });
    setIsFormModalOpen(true);
  };

  const openEditForm = (menu: Menu) => {
    setFormMode("edit");
    setMenuToEditOrDelete(menu);
    setFormData({
      name: menu.name,
      category_id: menu.category?.id?.toString() || "",
      price: menu.price.toString(),
      description: menu.description || "",
      image_url: menu.image_url || "",
    });
    setIsFormModalOpen(true);
  };

  const openDeleteConfirm = (menu: Menu) => {
    setMenuToEditOrDelete(menu);
    setIsConfirmModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
        description: formData.description,
        image_url: formData.image_url,
      };

      if (formMode === "add") {
        await addMenu(payload);
        toast.success("Menu berhasil ditambahkan!");
      } else if (menuToEditOrDelete) {
        await editMenu(menuToEditOrDelete.id, payload);
        toast.success("Menu berhasil diperbarui!");
      }
      setIsFormModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan menu",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!menuToEditOrDelete) return;
    setIsSubmitting(true);
    try {
      await removeMenu(menuToEditOrDelete.id);
      toast.success(`Menu ${menuToEditOrDelete.name} dihapus.`);
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus");
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (menu: Menu) => {
    try {
      await toggleAvailability(menu.id);
      toast.success(
        `${menu.name} sekarang ${menu.is_available ? "Habis (Sold Out)" : "Tersedia"}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah status",
      );
    }
  };

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;

    const validIngredients = recipeForm.recipe_ingredients.filter(
      (ing) => ing.id && ing.quantity,
    );

    if (validIngredients.length === 0) {
      toast.error("Pilih setidaknya 1 bahan baku!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        prep_time: Number(recipeForm.prep_time),
        cook_time: Number(recipeForm.cook_time),
        cost_price: Number(recipeForm.cost_price),
        instructions: recipeForm.instructions,
        ingredients: validIngredients.map((ing) => ({
          id: Number(ing.id),
          quantity: Number(ing.quantity),
        })),
      };

      await addRecipe(selectedMenu.id, payload);
      toast.success("Resep berhasil disimpan!");
      setIsCreatingRecipe(false);
      closeRecipeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan resep",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIngredientRow = () => {
    setRecipeForm((prev) => ({
      ...prev,
      recipe_ingredients: [
        ...prev.recipe_ingredients,
        { id: "", quantity: "" },
      ],
    }));
  };

  const handleRemoveIngredientRow = (index: number) => {
    setRecipeForm((prev) => ({
      ...prev,
      recipe_ingredients: prev.recipe_ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedIngredients = [...recipeForm.recipe_ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setRecipeForm({ ...recipeForm, recipe_ingredients: updatedIngredients });
  };

  return (
    <div className="space-y-6 relative">
      {/* DELETE CONFIRM MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Hapus Menu
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Apakah Anda yakin ingin menghapus {menuToEditOrDelete?.name}?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl flex-1 border-slate-200 font-bold"
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {formMode === "add" ? "Tambah Menu Baru" : "Edit Menu"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Lengkapi informasi katalog menu di bawah ini.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-6 overflow-y-auto custom-scrollbar space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Menu
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-11 rounded-xl bg-slate-50 border-slate-200"
                  placeholder="Cth: Nasi Goreng Spesial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Kategori
                  </label>
                  <Select
                    required
                    value={formData.category_id}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category_id: v })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl z-[70] shadow-xl">
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id.toString()}
                          className="py-2.5 cursor-pointer focus:bg-slate-50"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Harga Jual (Rp)
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="h-11 rounded-xl bg-slate-50 border-slate-200"
                    placeholder="Cth: 25000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  URL Gambar (Opsional)
                </label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="h-11 rounded-xl bg-slate-50 border-slate-200"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="rounded-xl bg-slate-50 border-slate-200 min-h-[80px]"
                  placeholder="Penjelasan singkat menu..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 font-bold bg-[#c94430] hover:bg-[#b03a28] text-white"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER PAGE */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Menu
          </h2>
          <p className="text-sm text-slate-500">
            Kelola katalog menu, harga, rating, dan ketersediaan.
          </p>
        </div>
        <Button
          onClick={openAddForm}
          className="rounded-xl bg-[#c94430] px-4 py-5 font-semibold text-white hover:bg-[#b03a28] shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Tambah Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm h-fit">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Filter</h3>
            <SlidersHorizontal size={18} className="text-slate-400" />
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <h4 className="mb-3 font-semibold text-slate-700">Category</h4>
              <div className="space-y-3 text-slate-500">
                <label className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors">
                  <Checkbox
                    checked={selectedCategory === "All"}
                    onCheckedChange={() => setSelectedCategory("All")}
                    className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <Checkbox
                      checked={selectedCategory === item.name}
                      onCheckedChange={() => setSelectedCategory(item.name)}
                      className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

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
                      }
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

        <main className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
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

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="h-44 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
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
                  className={cn(
                    "group cursor-pointer rounded-2xl border border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94430] transition-all",
                    !menu.is_available && "opacity-60 grayscale-[50%]",
                  )}
                  onClick={() => {
                    setIsCreatingRecipe(false);
                    openRecipeModal(menu);
                  }}
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
                          handleToggle(menu);
                        }}
                        className={cn(
                          "h-8 w-8 shadow-sm",
                          menu.is_available
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-emerald-600 hover:bg-emerald-50",
                        )}
                      >
                        {menu.is_available ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(menu);
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
                          openDeleteConfirm(menu);
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
              ))}
            </div>
          )}
        </main>
      </div>

      {/* RECIPE MODAL */}
      {isRecipeModalOpen && selectedMenu && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
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
                onClick={closeRecipeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {/* JIKA RESEP SUDAH ADA & TIDAK DALAM MODE CREATING */}
              {selectedMenu.recipe && !isCreatingRecipe ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
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
                            {formatCurrency(selectedMenu.recipe.cost_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600/80 font-semibold mb-0.5">
                            Harga Jual
                          </p>
                          <p className="font-bold text-slate-700">
                            {formatCurrency(selectedMenu.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">
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
              ) : isCreatingRecipe ? (
                /* FORM BUAT RESEP */
                <form onSubmit={handleRecipeSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Prep Time (Menit)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={recipeForm.prep_time}
                        onChange={(e) =>
                          setRecipeForm({
                            ...recipeForm,
                            prep_time: e.target.value,
                          })
                        }
                        className="rounded-xl border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Cook Time (Menit)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={recipeForm.cook_time}
                        onChange={(e) =>
                          setRecipeForm({
                            ...recipeForm,
                            cook_time: e.target.value,
                          })
                        }
                        className="rounded-xl border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Modal/HPP (Rp)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={recipeForm.cost_price}
                        onChange={(e) =>
                          setRecipeForm({
                            ...recipeForm,
                            cost_price: e.target.value,
                          })
                        }
                        className="rounded-xl border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Instruksi Memasak (SOP)
                    </label>
                    <Textarea
                      required
                      value={recipeForm.instructions}
                      onChange={(e) =>
                        setRecipeForm({
                          ...recipeForm,
                          instructions: e.target.value,
                        })
                      }
                      className="rounded-xl min-h-[120px] bg-slate-50 border-slate-200"
                      placeholder="1. Panaskan minyak...&#10;2. Masukkan bumbu..."
                    />
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800">
                        Komposisi Bahan Baku
                      </h4>
                      <Button
                        type="button"
                        onClick={handleAddIngredientRow}
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus size={14} className="mr-1.5" /> Tambah Bahan
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {recipeForm.recipe_ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100"
                        >
                          <div className="flex-1">
                            <Select
                              value={ing.id}
                              onValueChange={(val) =>
                                handleIngredientChange(idx, "id", val)
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200">
                                <SelectValue placeholder="Pilih Bahan..." />
                              </SelectTrigger>
                              <SelectContent>
                                {ingredients.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.name} ({item.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-24">
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              placeholder="Qty"
                              value={ing.quantity}
                              onChange={(e) =>
                                handleIngredientChange(
                                  idx,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="bg-white border-slate-200"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveIngredientRow(idx)}
                            className="text-red-500 hover:bg-red-100 h-10 w-10 shrink-0"
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreatingRecipe(false)}
                      className="rounded-xl font-bold border-slate-200"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl font-bold bg-[#c94430] hover:bg-[#b03a28] text-white"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Resep"}
                    </Button>
                  </div>
                </form>
              ) : (
                /* EMPTY STATE JIKA BELUM ADA RESEP */
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <ChefHat size={48} className="mb-4 opacity-50" />
                  <p className="font-medium text-slate-600">
                    Belum ada resep internal untuk menu ini.
                  </p>
                  <Button
                    onClick={() => {
                      setRecipeForm({
                        prep_time: "",
                        cook_time: "",
                        cost_price: "",
                        instructions: "",
                        recipe_ingredients: [{ id: "", quantity: "" }],
                      });
                      setIsCreatingRecipe(true);
                    }}
                    className="mt-4 bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl"
                  >
                    <Plus size={16} className="mr-2" /> Buat Resep Baru
                  </Button>
                </div>
              )}
            </div>

            {!isCreatingRecipe && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={closeRecipeModal}
                  className="rounded-xl font-semibold border-slate-200"
                >
                  Tutup
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
