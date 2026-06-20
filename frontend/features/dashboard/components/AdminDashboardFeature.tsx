"use client";

import Image from "next/image";
import {
  ReceiptText,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Search,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import DashboardStatusBadge from "./DashboardStatusBadge";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

function formatRupiah(value: number | string | null | undefined) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function AdminDashboardFeature() {
  const { analytics, recentOrders, loading } = useAdminDashboard();

  const revenueChart = analytics?.revenue_chart ?? [];
  const categoryChart = analytics?.category_chart ?? [];
  const ordersWeekChart = analytics?.orders_week_chart ?? [];

  const totalRevenue = analytics?.today_revenue ?? 0;
  const totalCustomers = analytics?.total_customers ?? 0;

  // Baca metrics baru
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ff5722] rounded-3xl p-6 shadow-sm flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <ReceiptText size={24} />
            </div>

            <div>
              <p className="text-white/80 text-sm font-semibold mb-1">
                Total Orders
              </p>
              <h2 className="text-3xl font-bold">
                {analytics?.today_orders || 0}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-md mt-6">
            <ArrowUpRight size={14} />
            Live
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-[#ff5722] rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>

            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">
                Total Customer
              </p>
              <h2 className="text-3xl font-bold text-slate-800">
                {totalCustomers}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md mt-6">
            <ArrowDownRight size={14} />
            Live
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-[#ff5722] rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>

            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">
                Total Revenue
              </p>
              <h2 className="text-3xl font-bold text-slate-800">
                {formatRupiah(totalRevenue)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#ff5722] bg-orange-50 px-2 py-1 rounded-md mt-6">
            <ArrowUpRight size={14} />
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-1">
                Total Revenue
              </h3>
              <h2 className="text-3xl font-bold text-slate-900">
                {formatRupiah(totalRevenue)}
              </h2>
            </div>

            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800">
              From API <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 min-h-[250px] w-full">
            {revenueChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm font-medium text-slate-400">
                Data grafik revenue belum tersedia dari API.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChart}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(value) => `${Number(value) / 1000000}jt`}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <RechartsTooltip
                    formatter={(value) => formatRupiah(Number(value))}
                    cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ff5722"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#333333"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">Top Categories</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
              From API <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center min-h-[200px]">
            {categoryChart.length === 0 ? (
              <div className="text-sm font-medium text-slate-400 text-center">
                Data kategori belum tersedia dari API.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChart}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryChart.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          ["#ff5722", "#333333", "#ffcc80", "#f5f5f5"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {categoryChart.length > 0 && (
            <div className="grid grid-cols-2 gap-y-3 mt-4 text-xs font-bold text-slate-500">
              {categoryChart.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between pr-4"
                >
                  <span>{item.name}</span>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Orders Overview</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
                From API <ChevronDown size={14} />
              </button>
            </div>

            <div className="h-[180px] w-full">
              {ordersWeekChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm font-medium text-slate-400">
                  Data grafik order mingguan belum tersedia dari API.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ordersWeekChart}
                    margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                  >
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#333",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#ff5722"
                      radius={[6, 6, 6, 6]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Recent Orders</h3>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    placeholder="Search placeholder"
                    className="pl-8 h-9 text-xs rounded-lg bg-slate-50 border-transparent w-48"
                  />
                </div>

                <Button
                  variant="outline"
                  className="h-9 rounded-lg text-xs font-bold border-slate-200 text-slate-600"
                >
                  See All Orders
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Photo</th>
                    <th className="pb-3 font-medium">Menu</th>
                    <th className="pb-3 font-medium">Qty</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => {
                    const firstItem = order.items[0];

                    return (
                      <tr key={order.id}>
                        <td className="py-4 font-bold text-slate-500">
                          ORD{order.id.toString().padStart(4, "0")}
                        </td>

                        <td className="py-4">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300">
                            {firstItem?.menu?.image_url ? (
                              <Image
                                src={firstItem.menu.image_url}
                                alt={firstItem.menu.name || "menu"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Utensils size={16} />
                            )}
                          </div>
                        </td>

                        <td className="py-4">
                          <p className="font-bold text-slate-800">
                            {firstItem?.menu?.name || "Multiple Items"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {firstItem?.menu?.category?.name || "Category"}
                          </p>
                        </td>

                        <td className="py-4 font-bold text-slate-600">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}
                        </td>

                        <td className="py-4 font-bold text-[#ff5722]">
                          {formatRupiah(order.total_amount)}
                        </td>

                        <td className="py-4 font-bold text-slate-600">
                          {order.customer_name}
                        </td>

                        <td className="py-4 text-center">
                          <DashboardStatusBadge status={order.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {recentOrders.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">
                  Belum ada transaksi.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-fit">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">Order Types</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
              From API <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-8">
            <OrderTypeProgress
              title="Dine-In"
              percentage={orderTypes.dine_in.percentage}
              total={orderTypes.dine_in.total}
              icon={<Utensils size={20} strokeWidth={2.5} />}
            />

            <OrderTypeProgress
              title="Takeaway"
              percentage={orderTypes.takeaway.percentage}
              total={orderTypes.takeaway.total}
              icon={<ReceiptText size={20} strokeWidth={2.5} />}
            />

            <OrderTypeProgress
              title="Online"
              percentage={orderTypes.online.percentage}
              total={orderTypes.online.total}
              icon={<Utensils size={20} strokeWidth={2.5} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTypeProgress({
  title,
  percentage,
  total,
  icon,
}: {
  title: string;
  percentage: number;
  total: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-slate-800 text-sm">
            {title} <span className="text-slate-400 ml-1">{percentage}%</span>
          </p>
          <p className="font-bold text-slate-900">{total}</p>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#333333] h-full rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
