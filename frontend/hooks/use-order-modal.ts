import { useState } from "react";
import type { Order } from "@/types/order";

export function useOrderModal() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 200);
  };

  return {
    selectedOrder,
    isModalOpen,
    openModal,
    closeModal,
  };
}
