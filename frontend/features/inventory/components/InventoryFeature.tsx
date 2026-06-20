"use client";

import { useInventoryFeature } from "../hooks/use-inventory-feature";

import InventoryHeader from "./InventoryHeader";
import InventoryTable from "./InventoryTable";
import StockModal from "./StockModal";
import IngredientFormModal from "./IngredientFormModal";
import DeleteIngredientModal from "./DeleteIngredientModal";

export default function InventoryFeature() {
  const {
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
  } = useInventoryFeature();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <InventoryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openIngredientModal={() => openIngredientModal()}
      />

      <InventoryTable
        loading={loading}
        filteredIngredients={filteredIngredients}
        openIngredientModal={openIngredientModal}
        openDeleteModal={openDeleteModal}
        openStockModal={openStockModal}
      />

      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        selectedIngredient={selectedIngredient}
        stockActionType={stockActionType}
        stockAmount={stockAmount}
        setStockAmount={setStockAmount}
        stockReason={stockReason}
        setStockReason={setStockReason}
        onSubmit={handleUpdateStock}
        isSubmitting={isSubmitting}
      />

      <IngredientFormModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        formMode={ingredientFormMode}
        formData={ingredientForm}
        setFormData={setIngredientForm}
        onSubmit={handleIngredientSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteIngredientModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedIngredient={selectedIngredient}
        onConfirm={confirmDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
