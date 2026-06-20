import { Printer, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/types/order";
import {
  formatCurrency,
  formatDate,
  formatOrderNumber,
  formatTime,
} from "@/utils/order-formatters";
import { PaymentBadge, StatusBadge } from "./OrderStatusBadge";

type OrderCardProps = {
  order: Order;
  isProcessingAction: boolean;
  onOpenDetail: (order: Order) => void;
  onPayBill: (order: Order) => void;
  onChangeStatus: (orderId: number, status: OrderStatus) => void;
  onPrint: (order: Order) => void;
};
export default function OrderCard({
  order,
  isProcessingAction,
  onOpenDetail,
  onPayBill,
  onChangeStatus,
  onPrint,
}: OrderCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400">
            {formatDate(order.created_at)}
          </div>
          <div className="text-xs font-bold text-slate-900">
            {formatTime(order.created_at)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.payment_status} />
        </div>
      </div>

      <div className="mb-6 border-t border-slate-50 pt-4">
        <h3 className="text-xl font-bold text-slate-900 leading-tight">
          {order.customer_name}
        </h3>

        <div className="mt-1 text-xs font-bold text-[#c94430]">
          {formatOrderNumber(order.id)}
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {order.order_type.replace("_", " ")}
          {order.table_number && ` • Meja ${order.table_number}`}
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold text-slate-700">
                {item.quantity}x {item.menu.name}
              </p>

              {item.notes && (
                <p className="text-xs text-red-500 font-medium truncate">
                  Note: {item.notes}
                </p>
              )}
            </div>

            <div className="text-sm font-bold text-slate-900">
              {formatCurrency(item.subtotal)}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-auto">
        <div className="flex justify-between items-end mb-5">
          <span className="text-sm font-semibold text-slate-400">
            Total Pembayaran
          </span>
          <span className="text-xl font-bold text-[#c94430]">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenDetail(order)}
              // className ini diganti jadi solid background gelap dengan teks putih
              className="flex-1 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white shadow-sm"
            >
              Details
            </Button>

            {order.status !== "completed" && order.status !== "cancelled" && (
              <Button
                disabled={isProcessingAction}
                onClick={() => onChangeStatus(order.id, "cancelled")}
                variant="outline"
                className="flex-1 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle size={16} className="mr-1.5" /> Cancel
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {order.payment_status === "unpaid" &&
              order.status !== "cancelled" && (
                <Button
                  disabled={isProcessingAction}
                  onClick={() => onPayBill(order)}
                  className="flex-1 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-500/20"
                >
                  Pay Bill
                </Button>
              )}

            {order.status !== "completed" &&
              order.status !== "cancelled" &&
              order.payment_status === "paid" && (
                <Button
                  disabled={isProcessingAction}
                  onClick={() => onChangeStatus(order.id, "completed")}
                  className="flex-1 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20"
                >
                  Set Completed
                </Button>
              )}

            {order.status === "completed" &&
              order.payment_status === "paid" && (
                <Button
                  onClick={() => onPrint(order)}
                  className="flex-1 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                >
                  <Printer size={16} className="mr-2" /> Print
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
