"use client";

import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useOrderModal } from "@/hooks/use-order-modal";
import { useOrderConfirmModal } from "../hooks/use-order-confirm-modal";
import { useOrderPaymentModal } from "../hooks/use-order-payment-modal";
import { printReceipt } from "@/utils/receipt-printer";

import OrdersToolbar from "./OrdersToolbar";
import OrdersGrid from "./OrdersGrid";
import OrdersGridSkeleton from "./OrdersGridSkeleton";
import OrdersEmptyState from "./OrdersEmptyState";
import OrdersPagination from "./OrdersPagination";
import OrderDetailModal from "./OrderDetailModal";
import ConfirmOrderActionModal from "./ConfirmOrderActionModal";
import PaymentModal from "./PaymentModal";

export default function OrdersFeature() {
  const {
    filteredOrders,
    activeTab,
    setActiveTab,
    loading,
    error,
    isProcessingAction,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    fetchOrders,
    changeOrderStatus,
    payBill,
  } = useAdminOrders();

  const { selectedOrder, isModalOpen, openModal, closeModal } = useOrderModal();

  const { confirmModal, handleChangeStatus, closeConfirmModal } =
    useOrderConfirmModal(changeOrderStatus);

  const {
    paymentModal,
    setPaymentModal,
    handlePayBill,
    submitPayment,
    closePaymentModal,
  } = useOrderPaymentModal(payBill);

  return (
    <div className="space-y-6 relative">
      <OrdersToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <OrdersGridSkeleton />
      ) : filteredOrders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <>
          <OrdersGrid
            orders={filteredOrders}
            isProcessingAction={isProcessingAction}
            onOpenDetail={openModal}
            onPayBill={handlePayBill}
            onChangeStatus={handleChangeStatus}
            onPrint={printReceipt}
          />

          <OrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchQuery={searchQuery}
            fetchOrders={fetchOrders}
          />
        </>
      )}

      <ConfirmOrderActionModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isProcessingAction={isProcessingAction}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        order={paymentModal.order}
        amountPaid={paymentModal.amountPaid}
        isProcessingAction={isProcessingAction}
        setAmountPaid={(amount) =>
          setPaymentModal((prev) => ({ ...prev, amountPaid: amount }))
        }
        setAmountExact={() =>
          setPaymentModal((prev) => ({
            ...prev,
            amountPaid: String(prev.order?.total_amount || ""),
          }))
        }
        onSubmit={submitPayment}
        onCancel={closePaymentModal}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeModal}
        onPrint={printReceipt}
      />
    </div>
  );
}
