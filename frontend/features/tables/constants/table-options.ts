import type { TableStatus } from "@/types/table";

export const STATUS_OPTIONS: Array<{
  label: string;
  value: TableStatus | "all_statuses";
}> = [
  { label: "All Statuses", value: "all_statuses" },
  { label: "Available", value: "available" },
  { label: "In Use", value: "in_use" },
  { label: "Reserved", value: "reserved" },
  { label: "Maintenance", value: "maintenance" },
];
