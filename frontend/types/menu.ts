export type MenuCategory = {
  id?: number;
  name: string;
};

export type RecipeIngredient = {
  id: number;
  name: string;
  unit: string;
  pivot: {
    quantity: string | number;
  };
};

export type Recipe = {
  id: number;
  prep_time: number;
  cook_time: number;
  instructions: string;
  cost_price: string | number;
  ingredients: RecipeIngredient[];
};

export type Menu = {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  image_url?: string | null;
  rating?: string | number;
  category?: MenuCategory;
  recipe?: Recipe;
};
