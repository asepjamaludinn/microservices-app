import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecipeFormProps {
  recipeForm: any;
  setRecipeForm: (data: any) => void;
  ingredients: { id: number; name: string; unit: string }[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (idx: number) => void;
  onChangeIngredient: (idx: number, field: string, value: string) => void;
}

export default function RecipeForm({
  recipeForm,
  setRecipeForm,
  ingredients,
  isSubmitting,
  onSubmit,
  onCancel,
  onAddIngredient,
  onRemoveIngredient,
  onChangeIngredient,
}: RecipeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              setRecipeForm({ ...recipeForm, prep_time: e.target.value })
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
              setRecipeForm({ ...recipeForm, cook_time: e.target.value })
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
              setRecipeForm({ ...recipeForm, cost_price: e.target.value })
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
            setRecipeForm({ ...recipeForm, instructions: e.target.value })
          }
          className="rounded-xl min-h-[120px] bg-slate-50 border-slate-200"
          placeholder="1. Panaskan minyak...&#10;2. Masukkan bumbu..."
        />
      </div>

      <div className="border border-slate-200 rounded-2xl p-5 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800">Komposisi Bahan Baku</h4>
          <Button
            type="button"
            onClick={onAddIngredient}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus size={14} className="mr-1.5" /> Tambah Bahan
          </Button>
        </div>

        <div className="space-y-3">
          {recipeForm.recipe_ingredients.map((ing: any, idx: number) => (
            <div
              key={idx}
              className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100"
            >
              <div className="flex-1">
                <Select
                  value={ing.id}
                  onValueChange={(val) => onChangeIngredient(idx, "id", val)}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Pilih Bahan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
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
                    onChangeIngredient(idx, "quantity", e.target.value)
                  }
                  className="bg-white border-slate-200"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveIngredient(idx)}
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
          onClick={onCancel}
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
  );
}
