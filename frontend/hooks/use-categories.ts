"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/types/category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categories.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (payload: { name: string; slug: string }) => {
    await createCategory(payload);
    await fetchCategories();
  };

  const editCategory = async (
    id: number,
    payload: { name: string; slug: string },
  ) => {
    await updateCategory(id, payload);
    await fetchCategories();
  };

  const removeCategory = async (id: number) => {
    await deleteCategory(id);
    await fetchCategories();
  };

  const processedCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  return {
    categories: processedCategories,
    loading,
    searchQuery,
    setSearchQuery,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
}
