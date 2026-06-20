import { ChefHat, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeDetailView from "./RecipeDetailView";
import RecipeForm from "./RecipeForm";
import RecipeEmptyState from "./RecipeEmptyState";
import type { Menu } from "@/types/menu";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMenu: Menu | null;
  isCreatingRecipe: boolean;
  onStartCreate: () => void;
  recipeForm: any;
  setRecipeForm: (data: any) => void;
  ingredients: { id: number; name: string; unit: string }[];
  isSubmittingRecipe: boolean;
  onRecipeSubmit: (e: React.FormEvent) => void;
  onCancelCreate: () => void;
  onAddIngredientRow: () => void;
  onRemoveIngredientRow: (idx: number) => void;
  onIngredientChange: (idx: number, field: string, value: string) => void;
}

export default function RecipeModal({
  isOpen,
  onClose,
  selectedMenu,
  isCreatingRecipe,
  onStartCreate,
  recipeForm,
  setRecipeForm,
  ingredients,
  isSubmittingRecipe,
  onRecipeSubmit,
  onCancelCreate,
  onAddIngredientRow,
  onRemoveIngredientRow,
  onIngredientChange,
}: RecipeModalProps) {
  if (!isOpen || !selectedMenu) return null;

  return (
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
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {selectedMenu.recipe && !isCreatingRecipe ? (
            <RecipeDetailView menu={selectedMenu} />
          ) : isCreatingRecipe ? (
            <RecipeForm
              recipeForm={recipeForm}
              setRecipeForm={setRecipeForm}
              ingredients={ingredients}
              isSubmitting={isSubmittingRecipe}
              onSubmit={onRecipeSubmit}
              onCancel={onCancelCreate}
              onAddIngredient={onAddIngredientRow}
              onRemoveIngredient={onRemoveIngredientRow}
              onChangeIngredient={onIngredientChange}
            />
          ) : (
            <RecipeEmptyState onStartCreate={onStartCreate} />
          )}
        </div>

        {!isCreatingRecipe && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-semibold border-slate-200"
            >
              Tutup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
