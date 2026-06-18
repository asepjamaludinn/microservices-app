"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useOrderModal } from "@/hooks/use-order-modal";
import { printReceipt } from "@/utils/receipt-printer";
import { ORDER_TABS } from "@/utils/order-formatters";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./OrderDetailModal";
import type { OrderStatus } from "@/types/order";

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

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handlePayBill = (orderId: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Pelunasan",
      message: `Apakah Anda yakin ingin memproses pelunasan untuk Order #${orderId.toString().padStart(4, "0")}?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await payBill(orderId);
          toast.success("Pembayaran berhasil diproses!");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal memproses");
        }
      },
    });
  };

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

  return (
    <div className="space-y-6 relative">
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              {confirmModal.message}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="rounded-xl font-bold flex-1"
                disabled={isProcessingAction}
              >
                Batal
              </Button>
              <Button
                onClick={confirmModal.onConfirm}
                disabled={isProcessingAction}
                className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl font-bold flex-1 shadow-sm"
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-slate-100 w-max">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#c94430] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari pelanggan / ID otomatis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-[#c94430]/20 min-w-[280px]"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 w-1/3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex flex-col items-end gap-2 w-1/3">
                  <Skeleton className="h-6 w-full rounded-full" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
              <div className="mb-6 border-t border-slate-50 pt-4 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="space-y-3 mb-5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 mt-auto space-y-4">
                <div className="flex justify-between items-end">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-xl" />
                  <Skeleton className="h-10 flex-1 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
          <p className="font-bold text-lg text-slate-600">Tidak ada pesanan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProcessingAction={isProcessingAction}
                onOpenDetail={openModal}
                onPayBill={handlePayBill}
                onChangeStatus={handleChangeStatus}
                onPrint={printReceipt}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => fetchOrders(currentPage - 1, searchQuery)}
                disabled={currentPage === 1}
                className="rounded-xl border-slate-200 bg-white"
              >
                Previous
              </Button>
              <span className="text-sm font-semibold text-slate-500">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchOrders(currentPage + 1, searchQuery)}
                disabled={currentPage === totalPages}
                className="rounded-xl border-slate-200 bg-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeModal}
        onPrint={printReceipt}
      />
    </div>
  );
}
