import { useState } from "react";

export function useDeleteTableModal(
  removeTable: (id: number) => Promise<void>,
  showToast: (msg: string, type: "success" | "error") => void,
) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });

  const handleDelete = (id: number, number: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus",
      message: `Apakah Anda yakin ingin menghapus Meja ${number}? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await removeTable(id);
          showToast(`Meja ${number} berhasil dihapus.`, "success");
        } catch (error) {
          showToast(
            error instanceof Error ? error.message : "Gagal menghapus meja",
            "error",
          );
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmModal,
    handleDelete,
    closeConfirmModal,
  };
}
