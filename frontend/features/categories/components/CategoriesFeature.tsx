"usehead";
"use client";

import { useState } from "react";
import { Plus, Tags, Search } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { CategoryFormModal } from "./CategoryFormModal";
import { CategoryTable } from "./CategoryTable";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

export default function CategoriesFeature() {
  const {
    categories,
    loading,
    searchQuery,
    setSearchQuery,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: any;
    isSubmitting: boolean;
    errorWarning: string | null;
  }>({
    isOpen: false,
    category: null,
    isSubmitting: false,
    errorWarning: null,
  });

  const openModal = (category?: any) => {
    setEditingCategory(category || null);
    setFormData(
      category
        ? { name: category.name, slug: category.slug }
        : { name: "", slug: "" },
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      editingCategory
        ? await editCategory(editingCategory.id, formData)
        : await addCategory(formData);
      toast.success("Kategori berhasil disimpan!");
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitiateDelete = (category: any) => {
    setDeleteModal({
      isOpen: true,
      category: category,
      isSubmitting: false,
      errorWarning: null,
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteModal.category) return;

    setDeleteModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await removeCategory(deleteModal.category.id);
      toast.success("Kategori berhasil dihapus!");
      setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setDeleteModal((prev) => ({
        ...prev,
        errorWarning: err.message || "Gagal menghapus kategori",
      }));
    } finally {
      setDeleteModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            Manajemen Kategori
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola kategori menu restoran Anda dengan aman dan terstruktur.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#c94430]/20"
            />
          </div>
          <Button
            onClick={() => openModal()}
            className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl h-10 font-semibold tracking-wide shrink-0"
          >
            <Plus size={18} className="md:mr-1.5" />
            <span className="hidden md:inline">Tambah Kategori</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400 p-12">
            <Tags size={48} className="opacity-20 mb-3" />
            <p className="font-semibold text-sm">
              Belum ada master kategori dibuat.
            </p>
          </div>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={openModal}
            onDelete={handleInitiateDelete}
          />
        )}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        isEditing={!!editingCategory}
      />

      <DeleteCategoryModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleExecuteDelete}
        category={deleteModal.category}
        isSubmitting={deleteModal.isSubmitting}
        errorWarning={deleteModal.errorWarning}
      />
    </div>
  );
}
