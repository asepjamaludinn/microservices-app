import { CalendarRange } from "lucide-react";

export default function ReservationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <CalendarRange size={48} className="opacity-20 mb-3" />
      <p className="font-semibold">Belum ada reservasi pelanggan.</p>
    </div>
  );
}
