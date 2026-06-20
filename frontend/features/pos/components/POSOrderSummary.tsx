interface POSOrderSummaryProps {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export default function POSOrderSummary({
  subtotal,
  taxAmount,
  totalAmount,
}: POSOrderSummaryProps) {
  return (
    <div className="space-y-2 mb-5">
      <div className="flex justify-between text-sm font-medium text-slate-500">
        <span>Subtotal</span>
        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-sm font-medium text-slate-500">
        <span>PPN (11%)</span>
        <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
        <span>Total Bayar</span>
        <span className="text-[#c94430]">
          Rp {totalAmount.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
