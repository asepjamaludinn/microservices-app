import { Ingredient } from "@/types";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryTableRow from "./InventoryTableRow";

interface InventoryTableProps {
  loading: boolean;
  filteredIngredients: Ingredient[];
  openIngredientModal: (ingredient: Ingredient) => void;
  openDeleteModal: (ingredient: Ingredient) => void;
  openStockModal: (ingredient: Ingredient, type: "in" | "out") => void;
}

export default function InventoryTable({
  loading,
  filteredIngredients,
  openIngredientModal,
  openDeleteModal,
  openStockModal,
}: InventoryTableProps) {
  if (loading) return <InventoryTableSkeleton />;

  return (
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
          {filteredIngredients.map((item) => (
            <InventoryTableRow
              key={item.id}
              item={item}
              openIngredientModal={openIngredientModal}
              openDeleteModal={openDeleteModal}
              openStockModal={openStockModal}
            />
          ))}
        </tbody>
      </table>
      {filteredIngredients.length === 0 && (
        <div className="p-12 text-center text-slate-400 font-medium">
          Bahan baku tidak ditemukan.
        </div>
      )}
    </div>
  );
}
