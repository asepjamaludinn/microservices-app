"use client";

import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

import DashboardStatCards from "./DashboardStatCards";
import RevenueChartCard from "./RevenueChartCard";
import TopCategoriesCard from "./TopCategoriesCard";
import OrdersOverviewCard from "./OrdersOverviewCard";
import RecentOrdersTable from "./RecentOrdersTable";
import OrderTypesCard from "./OrderTypesCard";

export default function AdminDashboardFeature() {
  const { analytics, recentOrders, loading } = useAdminDashboard();

  const revenueChart = analytics?.revenue_chart ?? [];
  const categoryChart = analytics?.category_chart ?? [];
  const ordersWeekChart = analytics?.orders_week_chart ?? [];

  const totalRevenue = analytics?.today_revenue ?? 0;
  const totalCustomers = analytics?.total_customers ?? 0;
  const todayOrders = analytics?.today_orders ?? 0;

  const orderTypes = analytics?.order_types ?? {
    dine_in: { total: 0, percentage: 0 },
    takeaway: { total: 0, percentage: 0 },
    online: { total: 0, percentage: 0 },
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff5722] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-[#faf9f7] min-h-screen -m-8 p-8">
      <DashboardStatCards
        todayOrders={todayOrders}
        totalCustomers={totalCustomers}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChartCard
          totalRevenue={totalRevenue}
          revenueChart={revenueChart}
        />
        <TopCategoriesCard categoryChart={categoryChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrdersOverviewCard ordersWeekChart={ordersWeekChart} />
          <RecentOrdersTable recentOrders={recentOrders} />
        </div>

        <OrderTypesCard orderTypes={orderTypes} />
      </div>
    </div>
  );
}
