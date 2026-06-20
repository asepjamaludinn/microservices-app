import { Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/order-formatters";
import type { Order } from "@/types/order";

interface PaymentModalProps {
  isOpen: boolean;
  order: Order | null;
  amountPaid: string;
  isProcessingAction: boolean;
  setAmountPaid: (amount: string) => void;
  setAmountExact: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PaymentModal({
  isOpen,
  order,
  amountPaid,
  isProcessingAction,
  setAmountPaid,
  setAmountExact,
  onSubmit,
  onCancel,
}: PaymentModalProps) {
  if (!isOpen || !order) return null;

  const totalAmount = Number(order.total_amount);
  const paid = Number(amountPaid);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Banknote size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              Proses Pembayaran
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Order #{order.id.toString().padStart(4, "0")} -{" "}
              {order.customer_name}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-semibold">Total Tagihan</span>
            <span className="font-black text-[#c94430] text-lg">
              {formatCurrency(order.total_amount)}
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Uang Diterima (Rp)
              </label>
              <button
                type="button"
                onClick={setAmountExact}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Uang Pas?
              </button>
            </div>
            <Input
              type="number"
              min={order.total_amount}
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="font-bold text-lg h-12 bg-white border-slate-300 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              placeholder="0"
              autoFocus
            />
          </div>

          {paid >= totalAmount && (
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 animate-in fade-in">
              <span className="text-slate-500 font-semibold">Kembalian</span>
              <span className="font-black text-emerald-600 text-lg">
                {formatCurrency(paid - totalAmount)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-xl font-bold flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={isProcessingAction}
          >
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isProcessingAction || !amountPaid || paid < totalAmount}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex-1 shadow-sm shadow-emerald-500/20"
          >
            {isProcessingAction ? "Memproses..." : "Bayar & Cetak"}
          </Button>
        </div>
      </div>
    </div>
  );
}
