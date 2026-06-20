import { Suspense } from "react";
import AuditLogsFeature from "@/features/audit-logs/components/AuditLogsFeature";

export const metadata = {
  title: "Audit Logs | Admin Dashboard",
};

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditLogsFeature />
    </Suspense>
  );
}
