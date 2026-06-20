"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  PackageOpen,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getInventory,
  updateStock,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "@/services/inventory.service";
import { Ingredient } from "@/types";

export default function InventoryFeature() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockActionType, setStockActionType] = useState<"in" | "out">("in");
  const [stockAmount, setStockAmount] = useState("");
  const [stockReason, setStockReason] = useState("");

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredientFormMode, setIngredientFormMode] = useState<"add" | "edit">(
    "add",
  );
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    unit: "",
    stock: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setIngredients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openStockModal = (ingredient: Ingredient, type: "in" | "out") => {
    setSelectedIngredient(ingredient);
    setStockActionType(type);
    setStockAmount("");
    setStockReason("");
    setIsStockModalOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient || !stockAmount || Number(stockAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      await updateStock(
        selectedIngredient.id,
        stockActionType,
        Number(stockAmount),
        stockReason || undefined,
      );
      toast.success(
        `Stok berhasil di${stockActionType === "in" ? "tambahkan" : "kurangi"}!`,
      );
      setIsStockModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openIngredientModal = (ingredient?: Ingredient) => {
    if (ingredient) {
      setIngredientFormMode("edit");
      setSelectedIngredient(ingredient);
      setIngredientForm({
        name: ingredient.name,
        unit: ingredient.unit,
        stock: "",
      });
    } else {
      setIngredientFormMode("add");
      setSelectedIngredient(null);
      setIngredientForm({ name: "", unit: "", stock: "" });
    }
    setIsIngredientModalOpen(true);
  };

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (ingredientFormMode === "add") {
        await createIngredient({
          name: ingredientForm.name,
          unit: ingredientForm.unit,
          stock: ingredientForm.stock ? Number(ingredientForm.stock) : 0,
        });
        toast.success("Bahan baku baru berhasil ditambahkan!");
      } else if (selectedIngredient) {
        await updateIngredient(selectedIngredient.id, {
          name: ingredientForm.name,
          unit: ingredientForm.unit,
        });
        toast.success("Bahan baku berhasil diperbarui!");
      }
      setIsIngredientModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedIngredient) return;
    setIsSubmitting(true);
    try {
      await deleteIngredient(selectedIngredient.id);
      toast.success(`Bahan baku ${selectedIngredient.name} dihapus.`);
      setIsDeleteModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const calculateBarWidth = (stock: number) => {
    const MAX_CAPACITY = 20000;
    const percentage = (stock / MAX_CAPACITY) * 100;
    return Math.min(Math.max(percentage, 2), 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lacak dan kelola stok bahan baku restoran.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Cari bahan baku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-[#c94430]/20"
            />
          </div>
          <Button
            onClick={() => openIngredientModal()}
            className="rounded-xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold h-10 shrink-0"
          >
            <Plus size={16} className="mr-2" /> Tambah Bahan
          </Button>
        </div>
      </div>

      {/* TABEL DATA */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-6 py-2">
                <div className="flex items-center gap-3 w-1/4">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-md w-1/6" />
                <div className="w-1/3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
                <div className="flex gap-2 ml-auto">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 w-1/3">Stock Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filteredIngredients.map((item) => {
                const stockNum = Number(item.stock);
                const isLow = item.status === "Low Stock";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PackageOpen size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: ING-{item.id.toString().padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="flex w-max items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-red-600 bg-red-50 border border-red-100">
                          Low Stock
                        </span>
                      ) : (
                        <span className="flex w-max items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold ${isLow ? "text-red-500" : "text-slate-500"}`}
                        >
                          {stockNum.toLocaleString("id-ID")}{" "}
                          <span className="font-medium text-slate-400">
                            {item.unit}
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-red-500" : "bg-[#c94430]"}`}
                          style={{ width: `${calculateBarWidth(stockNum)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openIngredientModal(item)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(item)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <div className="w-px h-6 bg-slate-200 self-center mx-1"></div>
                        <Button
                          onClick={() => openStockModal(item, "in")}
                          variant="outline"
                          size="sm"
                          className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus size={14} className="mr-1" /> Masuk
                        </Button>
                        <Button
                          onClick={() => openStockModal(item, "out")}
                          variant="outline"
                          size="sm"
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Minus size={14} className="mr-1" /> Keluar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredIngredients.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-medium">
              Bahan baku tidak ditemukan.
            </div>
          )}
        </div>
      )}

      {/* 1. Modal Input Stock (Masuk/Keluar) */}
      {isStockModalOpen && selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {stockActionType === "in"
                    ? "Tambah Stok Masuk"
                    : "Catat Stok Keluar"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Item: {selectedIngredient.name}
                </p>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Jumlah ({selectedIngredient.unit})
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={stockAmount}
                    onChange={(e) => setStockAmount(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-slate-200 font-bold"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {stockActionType === "in" ? (
                      <Plus size={16} className="text-emerald-500" />
                    ) : (
                      <Minus size={16} className="text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Keterangan / Alasan
                </label>
                <Input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder={
                    stockActionType === "in"
                      ? "Cth: Dari Supplier A"
                      : "Cth: Barang Expired / Basi"
                  }
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 rounded-xl h-11 font-bold text-white shadow-sm ${stockActionType === "in" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}
                >
                  {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Add/Edit Ingredient */}
      {isIngredientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {ingredientFormMode === "add"
                    ? "Tambah Bahan Baku Baru"
                    : "Edit Bahan Baku"}
                </h3>
              </div>
              <button
                onClick={() => setIsIngredientModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleIngredientSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Bahan Baku
                </label>
                <Input
                  required
                  placeholder="Cth: Bawang Putih"
                  value={ingredientForm.name}
                  onChange={(e) =>
                    setIngredientForm({
                      ...ingredientForm,
                      name: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Satuan Ukur
                  </label>
                  <Input
                    required
                    placeholder="Cth: gram, ml, pcs"
                    value={ingredientForm.unit}
                    onChange={(e) =>
                      setIngredientForm({
                        ...ingredientForm,
                        unit: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>
                {ingredientFormMode === "add" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Stok Awal
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={ingredientForm.stock}
                      onChange={(e) =>
                        setIngredientForm({
                          ...ingredientForm,
                          stock: e.target.value,
                        })
                      }
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsIngredientModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 font-bold bg-[#c94430] hover:bg-[#b03a28] text-white"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Confirm Delete */}
      {isDeleteModalOpen && selectedIngredient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Hapus Bahan Baku
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Yakin ingin menghapus <strong>{selectedIngredient.name}</strong>?
              Jika item ini digunakan pada resep, proses hapus akan ditolak oleh
              sistem.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl flex-1 font-bold"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
