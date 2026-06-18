import type { OrderStatus, PaymentStatus } from "@/types/order";
import { getPaymentLabel, getStatusLabel } from "@/utils/order-formatters";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const classNameMap: Record<OrderStatus, string> = {
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-500 text-white border-red-600", // <-- Diganti ke warna merah dan putih
    ready: "bg-blue-50 text-blue-600 border-blue-100",
    cooking: "bg-orange-50 text-orange-600 border-orange-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${classNameMap[status]}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const classNameMap: Record<PaymentStatus, string> = {
    paid: "text-emerald-500 bg-emerald-50",
    refunded: "text-slate-500 bg-slate-100",
    unpaid: "text-red-500 bg-red-50",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${classNameMap[status]}`}
    >
      {getPaymentLabel(status)}
    </span>
  );
}
