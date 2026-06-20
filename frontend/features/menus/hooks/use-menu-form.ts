import { useState } from "react";
import toast from "react-hot-toast";
import type { Menu } from "@/types/menu";

interface UseMenuFormProps {
  addMenu: (payload: any) => Promise<void>;
  editMenu: (id: number, payload: any) => Promise<void>;
  removeMenu: (id: number) => Promise<void>;
}

export function useMenuForm({
  addMenu,
  editMenu,
  removeMenu,
}: UseMenuFormProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [menuToEditOrDelete, setMenuToEditOrDelete] = useState<Menu | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    description: "",
    image_url: "",
  });

  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      name: "",
      category_id: "",
      price: "",
      description: "",
      image_url: "",
    });
    setIsFormModalOpen(true);
  };

  const openEditForm = (menu: Menu) => {
    setFormMode("edit");
    setMenuToEditOrDelete(menu);
    setFormData({
      name: menu.name,
      category_id: menu.category?.id?.toString() || "",
      price: menu.price.toString(),
      description: menu.description || "",
      image_url: menu.image_url || "",
    });
    setIsFormModalOpen(true);
  };

  const openDeleteConfirm = (menu: Menu) => {
    setMenuToEditOrDelete(menu);
    setIsConfirmModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
        description: formData.description,
        image_url: formData.image_url,
      };

      if (formMode === "add") {
        await addMenu(payload);
        toast.success("Menu berhasil ditambahkan!");
      } else if (menuToEditOrDelete) {
        await editMenu(menuToEditOrDelete.id, payload);
        toast.success("Menu berhasil diperbarui!");
      }
      setIsFormModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan menu",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!menuToEditOrDelete) return;
    setIsSubmitting(true);
    try {
      await removeMenu(menuToEditOrDelete.id);
      toast.success(`Menu ${menuToEditOrDelete.name} dihapus.`);
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus");
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isFormModalOpen,
    setIsFormModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isSubmitting,
    formMode,
    formData,
    setFormData,
    menuToEditOrDelete,
    openAddForm,
    openEditForm,
    openDeleteConfirm,
    handleFormSubmit,
    handleConfirmDelete,
  };
}
