export type OrderStatus =
  | "pending"
  | "cooking"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderType = "dine_in" | "takeaway";

export type OrderItem = {
  id: number;
  menu: {
    name: string;
    image_url?: string;
  };
  quantity: number;
  price: string;
  subtotal: string;
  notes: string | null;
};

export type Order = {
  id: number;
  customer_name: string;
  table_number: string | null;
  order_type: OrderType;
  status: OrderStatus;
  payment_method: string;
  payment_status: PaymentStatus;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
};

export type PaginatedOrderResponse = {
  data: Order[];
  current_page: number;
  last_page: number;
};
