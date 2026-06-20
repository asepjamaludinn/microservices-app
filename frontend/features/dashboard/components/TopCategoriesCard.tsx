// frontend/features/dashboard/components/TopCategoriesCard.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface TopCategoriesCardProps {
  categoryChart: any[]; // Sesuaikan tipe dengan model datamu
}

export default function TopCategoriesCard({
  categoryChart,
}: TopCategoriesCardProps) {
  return (
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
                      ["#ff5722", "#333333", "#ffcc80", "#f5f5f5"][index % 4]
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
  );
}
