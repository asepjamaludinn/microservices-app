"use client";

import { useEffect, useState } from "react";
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

// --- Tipe Data ---
type AnalyticsData = {
  today_orders: number;
  today_revenue: number;
  orders_in_progress: number;
  table_utilization: { occupied: number; total: number; percentage: number };
};

type OrderItem = {
  id: number;
  menu: { name: string; image_url?: string; category?: { name: string } };
  quantity: number;
  subtotal: string;
};
type Order = {
  id: number;
  customer_name: string;
  status: string;
  total_amount: string;
  items: OrderItem[];
};

// --- Mock Data untuk Grafik Visual (Agar persis seperti desain) ---
const revenueData = [
  { name: "Mar", income: 5000, expense: 3000 },
  { name: "Apr", income: 10000, expense: 5000 },
  { name: "May", income: 8000, expense: 4000 },
  { name: "Jun", income: 12000, expense: 6000 },
  { name: "Jul", income: 16580, expense: 8000 }, // Titik puncak di desain
  { name: "Aug", income: 11000, expense: 5000 },
  { name: "Sep", income: 17000, expense: 9000 },
  { name: "Oct", income: 15000, expense: 7000 },
];

const categoryData = [
  { name: "Seafood", value: 30, color: "#ff5722" }, // Orange
  { name: "Dessert", value: 25, color: "#333333" }, // Dark Gray
  { name: "Beverages", value: 25, color: "#ffcc80" }, // Light Orange
  { name: "Pasta", value: 20, color: "#f5f5f5" }, // Light Gray
];

const ordersWeekData = [
  { name: "Mon", orders: 130 },
  { name: "Tue", orders: 140 },
  { name: "Wed", orders: 160 },
  { name: "Thu", orders: 185 }, // Highlighted in design
  { name: "Fri", orders: 150 },
  { name: "Sat", orders: 150 },
  { name: "Sun", orders: 160 },
];

export default function DashboardHome() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil data Analytics Asli
        const resAnalytic = await fetch("/api/analytics");
        const dataAnalytic = await resAnalytic.json();
        if (resAnalytic.ok && dataAnalytic.data)
          setAnalytics(dataAnalytic.data);

        // 2. Ambil data Orders Asli untuk tabel Recent Orders
        const resOrders = await fetch("/api/orders");
        const dataOrders = await resOrders.json();
        if (resOrders.ok && dataOrders.data) {
          const ordersArray = Array.isArray(dataOrders.data)
            ? dataOrders.data
            : dataOrders.data.data;

          setRecentOrders(ordersArray.slice(0, 4));
        }
      } catch (error) {
        console.error("Gagal memuat dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-[#ff5722] text-white px-3 py-1 rounded-md text-xs font-bold">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-[#333333] text-white px-3 py-1 rounded-md text-xs font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-[#ffcc80] text-orange-900 px-3 py-1 rounded-md text-xs font-bold capitalize">
            On Process
          </span>
        );
    }
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
      {/* 1. TOP CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders Card (Orange) */}
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
            <ArrowUpRight size={14} /> 1.58%
          </div>
        </div>

        {/* Total Customer Card (White) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-[#ff5722] rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1">
                Total Customer
              </p>
              {/* Kita mock angka customer pakai rumusan sederhana dari total order */}
              <h2 className="text-3xl font-bold text-slate-800">
                {(analytics?.today_orders || 0) * 2 + 12}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md mt-6">
            <ArrowDownRight size={14} /> 0.42%
          </div>
        </div>

        {/* Total Revenue Card (White) */}
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
                $
                {(analytics?.today_revenue
                  ? analytics.today_revenue / 15000
                  : 0
                ).toFixed(0)}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#ff5722] bg-orange-50 px-2 py-1 rounded-md mt-6">
            <ArrowUpRight size={14} /> 2.36%
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-1">
                Total Revenue
              </h3>
              <h2 className="text-3xl font-bold text-slate-900">$184,839</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff5722]"></div>{" "}
                  Income
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#333333]"></div>{" "}
                  Expense
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800">
                Last 8 Months <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
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
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={10}
                />
                <RechartsTooltip
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
                  activeDot={{
                    r: 6,
                    fill: "#ff5722",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
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
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">Top Categories</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
              This Month <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-4 text-xs font-bold text-slate-500">
            {categoryData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between pr-4"
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  ></div>{" "}
                  {item.name}
                </span>
                <span className="text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: BAR CHARTS & TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Order Overview & Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Orders Overview</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
                This Week <ChevronDown size={14} />
              </button>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ordersWeekData}
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
                  <Bar dataKey="orders" radius={[6, 6, 6, 6]}>
                    {ordersWeekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === "Thu" ? "#ff5722" : "#fff3e0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
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
                <button className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  This Week <ChevronDown size={14} />
                </button>
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
                    <th className="pb-3 font-medium">
                      Order ID <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium">
                      Photo <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium">
                      Menu <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium">
                      Qty <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium">
                      Amount <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium">
                      Customer <ChevronDown size={12} className="inline ml-1" />
                    </th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => {
                    // Ambil item pertama sebagai perwakilan di tabel
                    const firstItem = order.items[0];
                    return (
                      <tr key={order.id}>
                        <td className="py-4 font-bold text-slate-500">
                          ORD{order.id.toString().padStart(4, "0")}
                        </td>
                        <td className="py-4">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300">
                            {firstItem?.menu?.image_url ? (
                              <img
                                src={firstItem.menu.image_url}
                                alt="menu"
                                className="w-full h-full object-cover"
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
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                        </td>
                        <td className="py-4 font-bold text-[#ff5722]">
                          ${(Number(order.total_amount) / 15000).toFixed(2)}
                        </td>
                        <td className="py-4 font-bold text-slate-600">
                          {order.customer_name}
                        </td>
                        <td className="py-4 text-center">
                          {getStatusBadge(order.status)}
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

        {/* Right Col: Order Types */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-fit">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">Order Types</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
              This Month <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Dine-In */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center shrink-0">
                <Utensils size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-800 text-sm">
                    Dine-In <span className="text-slate-400 ml-1">45%</span>
                  </p>
                  <p className="font-bold text-slate-900">900</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#333333] h-full w-[45%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Takeaway */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center shrink-0">
                <ReceiptText size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-800 text-sm">
                    Takeaway <span className="text-slate-400 ml-1">30%</span>
                  </p>
                  <p className="font-bold text-slate-900">600</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#333333] h-full w-[30%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Online */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center shrink-0">
                <Utensils size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-800 text-sm">
                    Online <span className="text-slate-400 ml-1">25%</span>
                  </p>
                  <p className="font-bold text-slate-900">500</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#333333] h-full w-[25%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
