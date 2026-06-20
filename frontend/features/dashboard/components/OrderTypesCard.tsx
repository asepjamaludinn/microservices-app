import { ChevronDown, Utensils, ReceiptText } from "lucide-react";
import OrderTypeProgress from "./OrderTypeProgress";

interface OrderTypeData {
  total: number;
  percentage: number;
}

interface OrderTypesCardProps {
  orderTypes: {
    dine_in: OrderTypeData;
    takeaway: OrderTypeData;
    online: OrderTypeData;
  };
}

export default function OrderTypesCard({ orderTypes }: OrderTypesCardProps) {
  return (
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
  );
}
