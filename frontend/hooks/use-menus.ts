"use client";

import { useEffect, useState, useCallback } from "react";
import type { Menu } from "@/types/menu";
import type { Category } from "@/types/category";
import type { Ingredient } from "@/types/inventory";
import {
  getMenus,
  getCategoriesList,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuAvailability,
  getIngredientsList,
  createMenuRecipe,
} from "@/services/menus.service";

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [menusData, categoriesData, ingredientsData] = await Promise.all([
        getMenus({ category: selectedCategory, rating: selectedRating }),
        getCategoriesList(),
        getIngredientsList(),
      ]);
      setMenus(menusData);
      setCategories(categoriesData as Category[]);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRating]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const menusData = await getMenus({
        search: searchQuery,
        category: selectedCategory,
        rating: selectedRating,
      });
      setMenus(menusData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openRecipeModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsRecipeModalOpen(true);
  };

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
    setTimeout(() => setSelectedMenu(null), 200);
  };

  const addMenu = async (payload: any) => {
    await createMenu(payload);
    await handleSearch();
  };

  const editMenu = async (id: number, payload: any) => {
    await updateMenu(id, payload);
    await handleSearch();
  };

  const removeMenu = async (id: number) => {
    await deleteMenu(id);
    await handleSearch();
  };

  const toggleAvailability = async (id: number) => {
    await toggleMenuAvailability(id);
    await handleSearch();
  };

  const addRecipe = async (menuId: number, payload: any) => {
    await createMenuRecipe(menuId, payload);
    await handleSearch();
  };

  return {
    menus,
    categories,
    ingredients,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRating,
    setSelectedRating,
    selectedMenu,
    isRecipeModalOpen,
    handleSearch,
    handleKeyDown,
    openRecipeModal,
    closeRecipeModal,
    addMenu,
    editMenu,
    removeMenu,
    toggleAvailability,
    addRecipe,
  };
}
