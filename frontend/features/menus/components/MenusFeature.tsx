"use client";

import toast from "react-hot-toast";
import { useMenus } from "@/hooks/use-menus";
import { useMenuForm } from "../hooks/use-menu-form";
import { useRecipeForm } from "../hooks/use-recipe-form";

import MenusHeader from "./MenusHeader";
import MenusFilterSidebar from "./MenusFilterSidebar";
import MenusGrid from "./MenusGrid";
import MenuFormModal from "./MenuFormModal";
import DeleteMenuModal from "./DeleteMenuModal";
import RecipeModal from "./RecipeModal";
import type { Menu } from "@/types/menu";

export default function MenusFeature() {
  const {
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
  } = useMenus();

  const {
    isFormModalOpen,
    setIsFormModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isSubmitting: isSubmittingMenu,
    formMode,
    formData,
    setFormData,
    menuToEditOrDelete,
    openAddForm,
    openEditForm,
    openDeleteConfirm,
    handleFormSubmit,
    handleConfirmDelete,
  } = useMenuForm({ addMenu, editMenu, removeMenu });

  const {
    isCreatingRecipe,
    setIsCreatingRecipe,
    recipeForm,
    setRecipeForm,
    isSubmittingRecipe,
    handleRecipeSubmit,
    handleAddIngredientRow,
    handleRemoveIngredientRow,
    handleIngredientChange,
  } = useRecipeForm({ selectedMenu, addRecipe, closeRecipeModal });

  const handleToggle = async (menu: Menu) => {
    try {
      await toggleAvailability(menu.id);
      toast.success(
        `${menu.name} sekarang ${menu.is_available ? "Habis (Sold Out)" : "Tersedia"}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah status",
      );
    }
  };

  const startCreateRecipe = () => {
    setRecipeForm({
      prep_time: "",
      cook_time: "",
      cost_price: "",
      instructions: "",
      recipe_ingredients: [{ id: "", quantity: "" }],
    });
    setIsCreatingRecipe(true);
  };

  return (
    <div className="space-y-6 relative">
      <MenusHeader openAddForm={openAddForm} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        <MenusFilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
        />

        <MenusGrid
          menus={menus}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleKeyDown={handleKeyDown}
          handleSearch={handleSearch}
          onOpenRecipe={(menu) => {
            setIsCreatingRecipe(false);
            openRecipeModal(menu);
          }}
          onToggleAvailability={handleToggle}
          onOpenEdit={openEditForm}
          onOpenDelete={openDeleteConfirm}
        />
      </div>

      <MenuFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmittingMenu}
        categories={categories}
      />

      <DeleteMenuModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        menu={menuToEditOrDelete}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmittingMenu}
      />

      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={closeRecipeModal}
        selectedMenu={selectedMenu}
        isCreatingRecipe={isCreatingRecipe}
        onStartCreate={startCreateRecipe}
        recipeForm={recipeForm}
        setRecipeForm={setRecipeForm}
        ingredients={ingredients}
        isSubmittingRecipe={isSubmittingRecipe}
        onRecipeSubmit={handleRecipeSubmit}
        onCancelCreate={() => setIsCreatingRecipe(false)}
        onAddIngredientRow={handleAddIngredientRow}
        onRemoveIngredientRow={handleRemoveIngredientRow}
        onIngredientChange={handleIngredientChange}
      />
    </div>
  );
}
