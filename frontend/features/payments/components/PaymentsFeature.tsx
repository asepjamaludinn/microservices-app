"use client";

import { usePayments } from "@/hooks/use-payments";
import { useRefundConfirmModal } from "../hooks/use-refund-confirm-modal";

import PaymentsHeader from "./PaymentsHeader";
import PaymentsTableSkeleton from "./PaymentsTableSkeleton";
import PaymentsEmptyState from "./PaymentsEmptyState";
import PaymentsTable from "./PaymentsTable";
import PaymentsPagination from "./PaymentsPagination";
import RefundConfirmModal from "./RefundConfirmModal";

export default function PaymentsFeature() {
  const {
    payments,
    loading,
    isProcessing,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    fetchPayments,
    handleRefund,
  } = usePayments();

  const { confirmModal, onInitiateRefund, closeConfirmModal } =
    useRefundConfirmModal(handleRefund);

  return (
    <div className="space-y-6 relative">
      <RefundConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isProcessing={isProcessing}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      <PaymentsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <PaymentsTableSkeleton />
        ) : payments.length === 0 ? (
          <PaymentsEmptyState />
        ) : (
          <PaymentsTable
            payments={payments}
            isProcessing={isProcessing}
            onInitiateRefund={onInitiateRefund}
          />
        )}

        <PaymentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          fetchPayments={fetchPayments}
        />
      </div>
    </div>
  );
}
