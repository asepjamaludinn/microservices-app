import { useState } from "react";
import toast from "react-hot-toast";
import type { Menu } from "@/types/menu";

interface UseRecipeFormProps {
  selectedMenu: Menu | null;
  addRecipe: (menuId: number, payload: any) => Promise<void>;
  closeRecipeModal: () => void;
}

export function useRecipeForm({
  selectedMenu,
  addRecipe,
  closeRecipeModal,
}: UseRecipeFormProps) {
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false);

  const [recipeForm, setRecipeForm] = useState({
    prep_time: "",
    cook_time: "",
    cost_price: "",
    instructions: "",
    recipe_ingredients: [{ id: "", quantity: "" }],
  });

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

    setIsSubmittingRecipe(true);
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
      setIsSubmittingRecipe(false);
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

  return {
    isCreatingRecipe,
    setIsCreatingRecipe,
    recipeForm,
    setRecipeForm,
    isSubmittingRecipe,
    handleRecipeSubmit,
    handleAddIngredientRow,
    handleRemoveIngredientRow,
    handleIngredientChange,
  };
}
