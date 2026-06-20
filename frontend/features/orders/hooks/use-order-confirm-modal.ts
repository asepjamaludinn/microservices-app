import { useState } from "react";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/types/order";

export function useOrderConfirmModal(
  changeOrderStatus: (id: number, status: OrderStatus) => Promise<void>,
) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });

  const handleChangeStatus = (orderId: number, status: OrderStatus) => {
    setConfirmModal({
      isOpen: true,
      title: "Ubah Status Pesanan",
      message: `Tandai Order #${orderId.toString().padStart(4, "0")} menjadi ${status.toUpperCase()}?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await changeOrderStatus(orderId, status);
          toast.success("Status pesanan berhasil diperbarui!");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal memproses");
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmModal,
    handleChangeStatus,
    closeConfirmModal,
  };
}
