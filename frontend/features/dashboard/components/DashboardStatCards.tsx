import {
  ReceiptText,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatRupiah } from "../utils/dashboard-formatters";

interface DashboardStatCardsProps {
  todayOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default function DashboardStatCards({
  todayOrders,
  totalCustomers,
  totalRevenue,
}: DashboardStatCardsProps) {
  return (
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
            <h2 className="text-3xl font-bold">{todayOrders}</h2>
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
  );
}
