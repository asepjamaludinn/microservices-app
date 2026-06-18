"use client";

import { useEffect, useState, useCallback } from "react";
import type { Menu } from "@/types/menu";
import {
  getMenus,
  getCategoriesList,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuAvailability,
} from "@/services/menus.service";

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<
    { id: number; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMenus({
        search: searchQuery,
        category: selectedCategory,
        rating: selectedRating,
      });
      setMenus(data);
    } catch (err) {
      console.error(err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedRating]);

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesList();
      setCategories(data);
    } catch (err) {
      console.error("Gagal load kategori", err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = () => fetchMenus();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const openRecipeModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsRecipeModalOpen(true);
  };
  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
    setTimeout(() => setSelectedMenu(null), 200);
  };

  const addMenu = async (payload: Partial<Menu>) => {
    await createMenu(payload);
    await fetchMenus();
  };

  const editMenu = async (id: number, payload: Partial<Menu>) => {
    await updateMenu(id, payload);
    await fetchMenus();
  };

  const removeMenu = async (id: number) => {
    await deleteMenu(id);
    await fetchMenus();
  };

  const toggleAvailability = async (id: number) => {
    await toggleMenuAvailability(id);
    await fetchMenus();
  };

  return {
    menus,
    categories,
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
  };
}
