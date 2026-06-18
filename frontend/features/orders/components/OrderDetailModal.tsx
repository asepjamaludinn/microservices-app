import { X, Receipt, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { formatCurrency, formatOrderNumber } from "@/utils/order-formatters";

type OrderDetailModalProps = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (order: Order) => void;
};

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onPrint,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c94430]/10 flex items-center justify-center text-[#c94430]">
              <Receipt size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                Nota {formatOrderNumber(order.id)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {order.customer_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-slate-100 pb-3 text-sm"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {item.quantity}x {item.menu.name}
                </p>

                {item.notes && (
                  <p className="text-xs text-red-500">Note: {item.notes}</p>
                )}
              </div>

              <p className="font-bold text-slate-700">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}

          <div className="space-y-2 pt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span className="font-semibold">
                {formatCurrency(order.tax_amount)}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-bold">
              <span>Total</span>
              <span className="text-[#c94430]">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-semibold border-slate-200 text-white"
          >
            Tutup
          </Button>

          {order.status === "completed" && order.payment_status === "paid" && (
            <Button
              onClick={() => onPrint(order)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold"
            >
              <Printer size={16} className="mr-2" />
              Print
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
