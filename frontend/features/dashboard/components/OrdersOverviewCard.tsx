"use client";

import { ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface OrdersOverviewCardProps {
  ordersWeekChart: any[];
}

export default function OrdersOverviewCard({
  ordersWeekChart,
}: OrdersOverviewCardProps) {
  return (
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
              <Bar dataKey="orders" fill="#ff5722" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
