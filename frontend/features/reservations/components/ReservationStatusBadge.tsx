import { getReservationStatusTheme } from "../utils/reservation-utils";

interface ReservationStatusBadgeProps {
  status: string;
}

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const theme = getReservationStatusTheme(status);

  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${theme}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
