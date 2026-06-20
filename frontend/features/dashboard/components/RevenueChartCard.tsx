"use client";

import { ChevronDown } from "lucide-react";
import { formatRupiah } from "../utils/dashboard-formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartCardProps {
  totalRevenue: number;
  revenueChart: any[];
}

export default function RevenueChartCard({
  totalRevenue,
  revenueChart,
}: RevenueChartCardProps) {
  return (
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
  );
}
