"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  PackageOpen,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  stock: string; // dari database Decimal menjadi string via API
  status: "Available" | "Low Stock";
  image_url: string | null;
};

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [actionType, setActionType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (res.ok && data.data) {
        setIngredients(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openModal = (ingredient: Ingredient, type: "in" | "out") => {
    setSelectedIngredient(ingredient);
    setActionType(type);
    setAmount("");
    setReason("");
    setIsModalOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${selectedIngredient.id}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: actionType,
          amount: Number(amount),
          reason: reason || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          `Stok berhasil di${actionType === "in" ? "tambahkan" : "kurangi"}!`,
        );
        setIsModalOpen(false);
        fetchInventory(); // Refresh data table
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Kalkulasi kapasitas bar indikator (Asumsi max stock 20.000 untuk tampilan visual)
  const calculateBarWidth = (stock: number) => {
    const MAX_CAPACITY = 20000;
    const percentage = (stock / MAX_CAPACITY) * 100;
    return Math.min(Math.max(percentage, 2), 100); // minimal 2%, maks 100%
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lacak dan kelola stok bahan baku restoran.
          </p>
        </div>
        <div className="relative w-full md:w-64">
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
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
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
                          <AlertCircle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="flex w-max items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                          <CheckCircle2 size={14} /> Available
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
                          onClick={() => openModal(item, "in")}
                          variant="outline"
                          size="sm"
                          className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus size={14} className="mr-1" /> Masuk
                        </Button>
                        <Button
                          onClick={() => openModal(item, "out")}
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

      {/* Modal Input Stock */}
      {isModalOpen && selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {actionType === "in"
                    ? "Tambah Stok Masuk"
                    : "Catat Stok Keluar"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Item: {selectedIngredient.name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-slate-200 font-bold"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {actionType === "in" ? (
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
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    actionType === "in"
                      ? "Cth: Dari Supplier A"
                      : "Cth: Barang Expired / Basi"
                  }
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 rounded-xl h-11 font-bold text-white shadow-sm ${actionType === "in" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}
                >
                  {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
