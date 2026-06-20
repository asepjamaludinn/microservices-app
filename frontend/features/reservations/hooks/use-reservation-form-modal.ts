import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getTables } from "@/services/tables.service";
import type { RestaurantTable } from "@/types/table";

export function useReservationFormModal(
  addReservation: (data: any) => Promise<void>,
) {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    table_id: "",
    customer_name: "",
    contact_number: "",
    reservation_time: "",
    guest_count: "",
  });

  useEffect(() => {
    getTables().then(setTables).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addReservation({
        ...formData,
        table_id: Number(formData.table_id),
        guest_count: Number(formData.guest_count),
      });
      setIsModalOpen(false);
      setFormData({
        table_id: "",
        customer_name: "",
        contact_number: "",
        reservation_time: "",
        guest_count: "",
      });
      toast.success("Reservasi berhasil dibuat!");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat reservasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    tables,
    isModalOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
  };
}
