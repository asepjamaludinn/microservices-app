import { Utensils, ShoppingBag } from "lucide-react";

interface POSOrderTypeToggleProps {
  orderType: string;
  onChangeOrderType: (type: "dine_in" | "takeaway") => void;
}

export default function POSOrderTypeToggle({
  orderType,
  onChangeOrderType,
}: POSOrderTypeToggleProps) {
  return (
    <div className="flex bg-slate-200/50 p-1 rounded-xl">
      <button
        type="button"
        onClick={() => onChangeOrderType("dine_in")}
        className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
          orderType === "dine_in"
            ? "bg-white shadow-sm text-[#c94430]"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        }`}
      >
        <Utensils size={16} /> Dine In
      </button>
      <button
        type="button"
        onClick={() => onChangeOrderType("takeaway")}
        className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
          orderType === "takeaway"
            ? "bg-white shadow-sm text-[#c94430]"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        }`}
      >
        <ShoppingBag size={16} /> Takeaway
      </button>
    </div>
  );
}
