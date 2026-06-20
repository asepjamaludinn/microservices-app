import { Suspense } from "react";
import ReservationsFeature from "@/features/reservations/components/ReservationsFeature";

export const metadata = { title: "Reservations | Admin Dashboard" };

export default function ReservationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationsFeature />
    </Suspense>
  );
}
