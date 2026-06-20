import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getInventory,
  updateStock,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "@/services/inventory.service";
import { Ingredient } from "@/types";

export function useInventoryFeature() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockActionType, setStockActionType] = useState<"in" | "out">("in");
  const [stockAmount, setStockAmount] = useState("");
  const [stockReason, setStockReason] = useState("");

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredientFormMode, setIngredientFormMode] = useState<"add" | "edit">(
    "add",
  );
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    unit: "",
    stock: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setIngredients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openStockModal = (ingredient: Ingredient, type: "in" | "out") => {
    setSelectedIngredient(ingredient);
    setStockActionType(type);
    setStockAmount("");
    setStockReason("");
    setIsStockModalOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient || !stockAmount) return;

    if (Number(stockAmount) <= 0) {
      toast.error("Jumlah stok tidak boleh 0 atau kurang.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStock(
        selectedIngredient.id,
        stockActionType,
        Number(stockAmount),
        stockReason || undefined,
      );
      toast.success(
        `Stok berhasil di${stockActionType === "in" ? "tambahkan" : "kurangi"}!`,
      );
      setIsStockModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openIngredientModal = (ingredient?: Ingredient) => {
    if (ingredient) {
      setIngredientFormMode("edit");
      setSelectedIngredient(ingredient);
      setIngredientForm({
        name: ingredient.name,
        unit: ingredient.unit,
        stock: "",
      });
    } else {
      setIngredientFormMode("add");
      setSelectedIngredient(null);
      setIngredientForm({ name: "", unit: "", stock: "" });
    }
    setIsIngredientModalOpen(true);
  };

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (ingredientFormMode === "add") {
        await createIngredient({
          name: ingredientForm.name,
          unit: ingredientForm.unit,
          stock: ingredientForm.stock ? Number(ingredientForm.stock) : 0,
        });
        toast.success("Bahan baku baru berhasil ditambahkan!");
      } else if (selectedIngredient) {
        await updateIngredient(selectedIngredient.id, {
          name: ingredientForm.name,
          unit: ingredientForm.unit,
        });
        toast.success("Bahan baku berhasil diperbarui!");
      }
      setIsIngredientModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedIngredient) return;
    setIsSubmitting(true);
    try {
      await deleteIngredient(selectedIngredient.id);
      toast.success(`Bahan baku ${selectedIngredient.name} dihapus.`);
      setIsDeleteModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    loading,
    searchQuery,
    setSearchQuery,
    filteredIngredients,
    selectedIngredient,
    isSubmitting,
    isStockModalOpen,
    setIsStockModalOpen,
    stockActionType,
    stockAmount,
    setStockAmount,
    stockReason,
    setStockReason,
    handleUpdateStock,
    openStockModal,
    isIngredientModalOpen,
    setIsIngredientModalOpen,
    ingredientFormMode,
    ingredientForm,
    setIngredientForm,
    handleIngredientSubmit,
    openIngredientModal,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
    openDeleteModal,
  };
}
