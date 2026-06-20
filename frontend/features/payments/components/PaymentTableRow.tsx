import { Clock, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/order-formatters";
import { formatDateTime } from "@/utils/date-formatters";

interface PaymentTableRowProps {
  pay: any;
  isProcessing: boolean;
  onInitiateRefund: (id: number, receiptNumber: string) => void;
}

export default function PaymentTableRow({
  pay,
  isProcessing,
  onInitiateRefund,
}: PaymentTableRowProps) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-mono font-semibold text-slate-700 bg-slate-100/70 border border-slate-200/60 px-2.5 py-1 rounded-lg text-xs tracking-wide">
          {pay.receipt_number}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="font-bold text-slate-900">
          Order #{pay.order_id.toString().padStart(4, "0")}
        </p>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {pay.order?.customer_name}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="font-bold text-slate-900">
          {formatCurrency(pay.amount_paid)}
        </p>
        <p className="text-xs text-emerald-600 font-medium mt-1 bg-emerald-50 inline-flex px-2 py-0.5 rounded-md">
          Kembalian: {formatCurrency(pay.change_amount)}
        </p>
      </td>
      <td className="px-6 py-4 text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-400" />
          {formatDateTime(pay.paid_at)}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <Button
          size="sm"
          variant="ghost"
          disabled={isProcessing || pay.order?.payment_status === "refunded"}
          onClick={() => onInitiateRefund(pay.id, pay.receipt_number)}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all h-9 px-4 rounded-xl font-semibold shadow-none hover:shadow-sm"
        >
          <ArrowLeftRight size={15} className="mr-2" /> Refund
        </Button>
      </td>
    </tr>
  );
}
