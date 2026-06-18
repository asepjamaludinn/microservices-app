"use client";

import { useState } from "react";
import { Banknote, Receipt, ArrowLeftRight, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payments";
import { formatCurrency } from "@/utils/order-formatters";
import { formatDateTime } from "@/utils/date-formatters";

export default function PaymentsFeature() {
  const {
    payments,
    loading,
    isProcessing,
    currentPage,
    totalPages,
    fetchPayments,
    handleRefund,
  } = usePayments();

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

  return (
    <div className="space-y-6 relative">
      {/* CONFIRMATION MODAL */}
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
                className="rounded-xl font-bold flex-1 border-slate-200 text-slate-600"
                disabled={isProcessing}
              >
                Batal
              </Button>
              <Button
                onClick={confirmModal.onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1 shadow-sm"
                disabled={isProcessing}
              >
                Refund
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Banknote className="text-[#c94430]" /> Riwayat Pembayaran
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lacak semua transaksi pembayaran dan struk yang telah dicetak.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Receipt size={48} className="opacity-20 mb-3" />
            <p className="font-semibold">Belum ada transaksi pembayaran.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Receipt No.</th>
                <th className="px-6 py-4">Order / Customer</th>
                <th className="px-6 py-4">Jumlah Bayar</th>
                <th className="px-6 py-4">Waktu Pembayaran</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {pay.receipt_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#c94430]">
                      Order #{pay.order_id.toString().padStart(4, "0")}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pay.order?.customer_name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">
                      {formatCurrency(pay.amount_paid)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kembalian: {formatCurrency(pay.change_amount)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} /> {formatDateTime(pay.paid_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        isProcessing || pay.order?.payment_status === "refunded"
                      }
                      onClick={() =>
                        onInitiateRefund(pay.id, pay.receipt_number)
                      }
                      className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
                    >
                      <ArrowLeftRight size={14} className="mr-1.5" /> Refund
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-center gap-4 bg-slate-50">
            <Button
              disabled={currentPage === 1}
              onClick={() => fetchPayments(currentPage - 1)}
              variant="outline"
            >
              Prev
            </Button>
            <span className="flex items-center text-sm">
              Hal {currentPage} dari {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => fetchPayments(currentPage + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
