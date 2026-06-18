"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Tags,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";
import { cn } from "@/lib/utils";

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

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({ name: "", slug: "" });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "" });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug dari nama
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData({ name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await editCategory(editingCategory.id, formData);
        showToast("Kategori berhasil diperbarui!");
      } else {
        await addCategory(formData);
        showToast("Kategori baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Gagal menyimpan kategori",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (category: Category) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Kategori",
      message: `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await removeCategory(category.id);
          showToast(`Kategori ${category.name} berhasil dihapus.`);
        } catch (error) {
          showToast(
            error instanceof Error ? error.message : "Gagal menghapus kategori",
            "error",
          );
        }
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {toast.show && (
        <div
          className={cn(
            "fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-white",
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {toast.message}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              {confirmModal.message}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="rounded-xl font-bold flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={confirmModal.onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Kategori
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola kategori menu restoran Anda.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-white border-slate-200 min-w-[250px]"
            />
          </div>
          <Button
            onClick={() => openModal()}
            className="rounded-xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold h-10"
          >
            <Plus size={16} className="mr-2" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* TABEL KATEGORI */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <Tags size={48} className="mb-3 opacity-30" />
            <p className="font-semibold">Kategori tidak ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-xs font-mono">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModal(category)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Kategori
                </label>
                <Input
                  required
                  placeholder="Cth: Minuman Dingin"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Slug (URL)
                </label>
                <Input
                  required
                  placeholder="Cth: minuman-dingin"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 font-mono text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 font-bold bg-[#c94430] hover:bg-[#b03a28] text-white"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
