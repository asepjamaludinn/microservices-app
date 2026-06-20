import { useState } from "react";
import toast from "react-hot-toast";

export function useRefundConfirmModal(
  handleRefund: (id: number) => Promise<void>,
) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });

  const onInitiateRefund = (id: number, receiptNumber: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Refund",
      message: `Apakah Anda yakin ingin memproses refund untuk struk ${receiptNumber}?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await handleRefund(id);
          toast.success("Refund berhasil diproses.");
        } catch (error) {
          toast.error("Gagal memproses refund.");
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmModal,
    onInitiateRefund,
    closeConfirmModal,
  };
}
