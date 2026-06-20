import ReservationTableRow from "./ReservationTableRow";

interface ReservationsTableProps {
  reservations: any[];
  isProcessing: boolean;
  onStatusChange: (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => void;
}

export default function ReservationsTable({
  reservations,
  isProcessing,
  onStatusChange,
}: ReservationsTableProps) {
  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
        <tr>
          <th className="px-6 py-4">Customer</th>
          <th className="px-6 py-4">Meja & Tamu</th>
          <th className="px-6 py-4">Waktu</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
        {reservations.map((res) => (
          <ReservationTableRow
            key={res.id}
            reservation={res}
            isProcessing={isProcessing}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}
