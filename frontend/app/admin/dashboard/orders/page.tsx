import { Suspense } from "react";
import OrdersFeature from "@/features/orders/components/OrdersFeature";

export const metadata = { title: "Orders | Admin Dashboard" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersFeature />
    </Suspense>
  );
}
