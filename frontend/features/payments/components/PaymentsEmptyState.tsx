import { Receipt } from "lucide-react";

export default function PaymentsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Receipt size={48} className="opacity-20 mb-3" />
      <p className="font-semibold">Belum ada transaksi pembayaran.</p>
    </div>
  );
}
