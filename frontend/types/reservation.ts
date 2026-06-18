import { RestaurantTable } from "./table";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type Reservation = {
  id: number;
  table_id: number;
  customer_name: string;
  contact_number: string | null;
  reservation_time: string;
  guest_count: number;
  status: ReservationStatus;
  table?: RestaurantTable;
  created_at: string;
};

export type PaginatedReservationResponse = {
  data: Reservation[];
  current_page: number;
  last_page: number;
};
