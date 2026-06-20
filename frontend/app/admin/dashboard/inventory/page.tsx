import { Suspense } from "react";
import InventoryFeature from "@/features/inventory/components/InventoryFeature";

export const metadata = { title: "Inventory | Admin Dashboard" };

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryFeature />
    </Suspense>
  );
}
