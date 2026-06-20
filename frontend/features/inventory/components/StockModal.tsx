import { X, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ingredient } from "@/types";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIngredient: Ingredient | null;
  stockActionType: "in" | "out";
  stockAmount: string;
  setStockAmount: (amount: string) => void;
  stockReason: string;
  setStockReason: (reason: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function StockModal({
  isOpen,
  onClose,
  selectedIngredient,
  stockActionType,
  stockAmount,
  setStockAmount,
  stockReason,
  setStockReason,
  onSubmit,
  isSubmitting,
}: StockModalProps) {
  if (!isOpen || !selectedIngredient) return null;

  return (
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
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
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
              onClick={onClose}
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
  );
}
