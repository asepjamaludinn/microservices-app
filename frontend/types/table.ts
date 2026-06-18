export type TableStatus = "available" | "in_use" | "reserved" | "maintenance";

export type RestaurantTable = {
  id: number;
  table_number: string;
  name: string | null;
  area: string;
  capacity: number;
  status: TableStatus;
  updated_at: string;
};
