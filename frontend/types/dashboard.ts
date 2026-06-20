export type RevenueChartItem = {
  name: string;
  income: number;
  expense: number;
};

export type CategoryChartItem = {
  name: string;
  value: number;
};

export type OrdersWeekChartItem = {
  name: string;
  orders: number;
};

export type AnalyticsData = {
  today_orders: number;
  today_revenue: number;
  total_customers?: number;
  orders_in_progress: number;
  table_utilization: {
    occupied: number;
    total: number;
    percentage: number;
  };
  revenue_chart?: RevenueChartItem[];
  category_chart?: CategoryChartItem[];
  orders_week_chart?: OrdersWeekChartItem[];
  order_types?: {
    dine_in: { total: number; percentage: number };
    takeaway: { total: number; percentage: number };
    online: { total: number; percentage: number };
  };
};

export type DashboardOrderItem = {
  id: number;
  menu: {
    name: string;
    image_url?: string | null;
    category?: {
      name: string;
    };
  };
  quantity: number;
  subtotal: string;
};

export type DashboardOrder = {
  id: number;
  customer_name: string;
  status: string;
  total_amount: string;
  items: DashboardOrderItem[];
};
