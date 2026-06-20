import { useState } from "react";

export function useAddTableModal(
  addTable: (data: any) => Promise<void>,
  showToast: (msg: string, type: "success" | "error") => void,
) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: "",
    area: "",
    capacity: "",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addTable({
        table_number: newTable.table_number,
        area: newTable.area || "Main Area",
        capacity: Number(newTable.capacity) || 2,
      });
      showToast("Meja baru berhasil ditambahkan!", "success");
      setIsAddModalOpen(false);
      setNewTable({ table_number: "", area: "", capacity: "" });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Gagal menambahkan meja",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    isSubmitting,
    newTable,
    setNewTable,
    handleAddSubmit,
  };
}
