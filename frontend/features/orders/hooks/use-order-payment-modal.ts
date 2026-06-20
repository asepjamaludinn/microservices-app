import { useState } from "react";
import toast from "react-hot-toast";
import type { Order } from "@/types/order";

export function useOrderPaymentModal(
  payBill: (id: number, amount: number) => Promise<void>,
) {
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    order: Order | null;
    amountPaid: string;
  }>({
    isOpen: false,
    order: null,
    amountPaid: "",
  });

  const handlePayBill = (order: Order) => {
    setPaymentModal({
      isOpen: true,
      order: order,
      amountPaid: "",
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, order: null, amountPaid: "" });
  };

  const submitPayment = async () => {
    if (!paymentModal.order) return;
    const amount = Number(paymentModal.amountPaid);
    const totalAmount = Number(paymentModal.order.total_amount);

    if (amount < totalAmount) {
      toast.error("Uang yang diterima kurang dari total tagihan!");
      return;
    }

    try {
      await payBill(paymentModal.order.id, amount);
      toast.success("Pembayaran berhasil diproses dan struk diterbitkan!");
      closePaymentModal();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memproses pembayaran",
      );
    }
  };

  return {
    paymentModal,
    setPaymentModal,
    handlePayBill,
    submitPayment,
    closePaymentModal,
  };
}
