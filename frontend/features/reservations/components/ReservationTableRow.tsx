import { User, Phone, Users } from "lucide-react";
import { formatDateTime } from "@/utils/date-formatters";
import ReservationStatusBadge from "./ReservationStatusBadge";
import ReservationActionButtons from "./ReservationActionButtons";

interface ReservationTableRowProps {
  reservation: any;
  isProcessing: boolean;
  onStatusChange: (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => void;
}

export default function ReservationTableRow({
  reservation: res,
  isProcessing,
  onStatusChange,
}: ReservationTableRowProps) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-6 py-4">
        <p className="font-bold text-slate-900 flex items-center gap-1.5">
          <User size={14} /> {res.customer_name}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
          <Phone size={12} /> {res.contact_number || "-"}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="font-bold text-[#c94430]">
          Meja {res.table?.table_number}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <Users size={12} /> {res.guest_count} Orang
        </p>
      </td>
      <td className="px-6 py-4">{formatDateTime(res.reservation_time)}</td>
      <td className="px-6 py-4">
        <ReservationStatusBadge status={res.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <ReservationActionButtons
          id={res.id}
          status={res.status}
          isProcessing={isProcessing}
          onStatusChange={onStatusChange}
        />
      </td>
    </tr>
  );
}
