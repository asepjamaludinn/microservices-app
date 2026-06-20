import { Armchair } from "lucide-react";

interface TablesSummaryCardsProps {
  summary: {
    totalTables: number;
    occupied: number;
    reserved: number;
    available: number;
  };
}

export default function TablesSummaryCards({
  summary,
}: TablesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-[#c94430] rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-32">
        <div className="absolute -right-4 -top-4 text-white/20">
          <Armchair size={80} />
        </div>
        <p className="font-medium text-white/90 z-10">Total Tables</p>
        <h2 className="text-4xl font-bold z-10">{summary.totalTables}</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <p className="font-bold text-slate-700">Occupied</p>
        <h2 className="text-4xl font-bold text-[#c94430] text-right">
          {summary.occupied}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <p className="font-bold text-slate-700">Reserved</p>
        <h2 className="text-4xl font-bold text-blue-600 text-right">
          {summary.reserved}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <p className="font-bold text-slate-700">Available</p>
        <h2 className="text-4xl font-bold text-emerald-600 text-right">
          {summary.available}
        </h2>
      </div>
    </div>
  );
}
