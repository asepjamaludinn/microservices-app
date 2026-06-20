import { Suspense } from "react";
import PaymentsFeature from "@/features/payments/components/PaymentsFeature";

export const metadata = { title: "Payments & Receipts | Admin Dashboard" };

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentsFeature />
    </Suspense>
  );
}
