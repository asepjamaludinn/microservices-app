import { Suspense } from "react";
import TablesFeature from "@/features/tables/components/TablesFeature";

export const metadata = { title: "Tables | Admin Dashboard" };

export default function TablesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TablesFeature />
    </Suspense>
  );
}
