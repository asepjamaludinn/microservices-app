import { Order } from "./order";

export type Payment = {
  id: number;
  order_id: number;
  receipt_number: string;
  amount_paid: string | number;
  change_amount: string | number;
  paid_at: string;
  order?: Order;
};

export type PaginatedPaymentResponse = {
  data: Payment[];
  current_page: number;
  last_page: number;
};
