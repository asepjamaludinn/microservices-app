import {
  ClipboardList,
  UtensilsCrossed,
  ChefHat,
  TrendingUp,
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-tight">
              <ClipboardList size={16} strokeWidth={2.5} /> Pending orders
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <TrendingUp size={16} />
            </button>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
              25
            </h2>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md tracking-tight">
              47% cleared
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-[#c94430] bg-[#c94430]/10 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-tight">
              <ChefHat size={16} strokeWidth={2.5} /> Orders in progress
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <TrendingUp size={16} />
            </button>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
              17
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-tight">
              <UtensilsCrossed size={16} strokeWidth={2.5} /> Available tables
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <TrendingUp size={16} />
            </button>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
              3
              <span className="text-2xl text-slate-400 font-semibold tracking-tight">
                /12
              </span>
            </h2>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md tracking-tight">
              87% booked
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px]">
          <p className="text-slate-400 font-medium tracking-tight">
            Area chart revenue
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px]">
          <p className="text-slate-400 font-medium tracking-tight">
            Business data summary
          </p>
        </div>
      </div>
    </div>
  );
}
