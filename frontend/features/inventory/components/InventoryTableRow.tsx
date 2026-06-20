import { PackageOpen, Edit2, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ingredient } from "@/types";
import { calculateBarWidth } from "../utils/inventory-utils";

interface InventoryTableRowProps {
  item: Ingredient;
  openIngredientModal: (ingredient: Ingredient) => void;
  openDeleteModal: (ingredient: Ingredient) => void;
  openStockModal: (ingredient: Ingredient, type: "in" | "out") => void;
}

export default function InventoryTableRow({
  item,
  openIngredientModal,
  openDeleteModal,
  openStockModal,
}: InventoryTableRowProps) {
  const stockNum = Number(item.stock);
  const isLow = item.status === "Low Stock";

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
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
            <span className="font-medium text-slate-400">{item.unit}</span>
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
        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Tombol Stok Masuk */}
          <Button
            variant="ghost"
            size="icon"
            title="Tambah Stok"
            onClick={() => openStockModal(item, "in")}
            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Plus size={15} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Kurangi Stok"
            onClick={() => openStockModal(item, "out")}
            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <Minus size={15} />
          </Button>

          <div className="w-px h-5 bg-slate-200 self-center mx-1"></div>

          <Button
            variant="ghost"
            size="icon"
            title="Edit Bahan"
            onClick={() => openIngredientModal(item)}
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit2 size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Hapus Bahan"
            onClick={() => openDeleteModal(item)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
