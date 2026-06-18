export type IngredientStatus = "Available" | "Low Stock";

export type Ingredient = {
  id: number;
  name: string;
  unit: string;
  stock: string;
  status: IngredientStatus;
  image_url: string | null;
};
