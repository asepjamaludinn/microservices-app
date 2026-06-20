import React from "react";

interface OrderTypeProgressProps {
  title: string;
  percentage: number;
  total: number;
  icon: React.ReactNode;
}

export default function OrderTypeProgress({
  title,
  percentage,
  total,
  icon,
}: OrderTypeProgressProps) {
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
