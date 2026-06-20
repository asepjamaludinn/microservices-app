import PaymentTableRow from "./PaymentTableRow";

interface PaymentsTableProps {
  payments: any[];
  isProcessing: boolean;
  onInitiateRefund: (id: number, receiptNumber: string) => void;
}

export default function PaymentsTable({
  payments,
  isProcessing,
  onInitiateRefund,
}: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
          <tr>
            <th className="px-6 py-5 rounded-tl-2xl">Receipt No.</th>
            <th className="px-6 py-5">Order / Customer</th>
            <th className="px-6 py-5">Jumlah Bayar</th>
            <th className="px-6 py-5">Waktu Pembayaran</th>
            <th className="px-6 py-5 text-right rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {payments.map((pay) => (
            <PaymentTableRow
              key={pay.id}
              pay={pay}
              isProcessing={isProcessing}
              onInitiateRefund={onInitiateRefund}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
