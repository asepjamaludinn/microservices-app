import type { TableStatus } from "@/types/table";
import { getTableStatusTheme, getTableStatusLabel } from "../utils/table-utils";

export default function TableStatusBadge({ status }: { status: TableStatus }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${getTableStatusTheme(status)}`}
    >
      {getTableStatusLabel(status)}
    </span>
  );
}
