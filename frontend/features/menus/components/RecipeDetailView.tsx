import { Clock, Flame, Receipt } from "lucide-react";
import { formatCurrency } from "@/utils/order-formatters";
import type { Menu } from "@/types/menu";

interface RecipeDetailViewProps {
  menu: Menu;
}

export default function RecipeDetailView({ menu }: RecipeDetailViewProps) {
  const recipe = menu.recipe!;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <Clock className="text-orange-500 mb-2" size={20} />
            <p className="text-xs text-orange-600/80 font-semibold mb-0.5">
              Waktu Persiapan
            </p>
            <p className="font-bold text-orange-700">
              {recipe.prep_time} Menit
            </p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <Flame className="text-red-500 mb-2" size={20} />
            <p className="text-xs text-red-600/80 font-semibold mb-0.5">
              Waktu Memasak
            </p>
            <p className="font-bold text-red-700">{recipe.cook_time} Menit</p>
          </div>
          <div className="col-span-2 bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600/80 font-semibold mb-0.5 flex items-center gap-1">
                <Receipt size={14} /> Modal / HPP
              </p>
              <p className="font-bold text-emerald-700 text-lg">
                {formatCurrency(recipe.cost_price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-600/80 font-semibold mb-0.5">
                Harga Jual
              </p>
              <p className="font-bold text-slate-700">
                {formatCurrency(menu.price)}
              </p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-3">Komposisi Bahan</h4>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing) => (
              <li
                key={ing.id}
                className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm"
              >
                <span className="font-medium text-slate-700">{ing.name}</span>
                <span className="font-bold text-[#c94430] bg-[#c94430]/10 px-2 py-1 rounded-md text-xs">
                  {Number(ing.pivot.quantity)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-3">Langkah Memasak (SOP)</h4>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
          {recipe.instructions}
        </div>
        <div className="mt-6">
          <h4 className="font-bold text-slate-900 mb-3">
            Deskripsi Menu Publik
          </h4>
          <p className="text-sm text-slate-500 italic">"{menu.description}"</p>
        </div>
      </div>
    </div>
  );
}
