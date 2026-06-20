"use client";

import toast from "react-hot-toast";
import { useReservations } from "@/hooks/use-reservations";
import { useReservationFormModal } from "../hooks/use-reservation-form-modal";

import ReservationsHeader from "./ReservationsHeader";
import ReservationsTable from "./ReservationsTable";
import ReservationsTableSkeleton from "./ReservationsTableSkeleton";
import ReservationsEmptyState from "./ReservationsEmptyState";
import ReservationFormModal from "./ReservationFormModal";

export default function ReservationsFeature() {
  const {
    reservations,
    loading,
    isProcessing,
    searchQuery,
    setSearchQuery,
    addReservation,
    changeStatus,
  } = useReservations();

  const {
    tables,
    isModalOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
  } = useReservationFormModal(addReservation);

  const handleStatusChange = async (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => {
    try {
      await changeStatus(id, action);
      toast.success(`Status reservasi berhasil diperbarui (${action}).`);
    } catch (err: any) {
      toast.error(err.message || "Gagal merubah status reservasi");
    }
  };

  return (
    <div className="space-y-6">
      <ReservationsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenModal={openModal}
      />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <ReservationsTableSkeleton />
        ) : reservations.length === 0 ? (
          <ReservationsEmptyState />
        ) : (
          <ReservationsTable
            reservations={reservations}
            isProcessing={isProcessing}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <ReservationFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        tables={tables}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
