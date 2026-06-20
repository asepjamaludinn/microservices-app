import { Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatOrderNumber } from "@/utils/order-formatters";

interface UserOrderCardProps {
  order: any;
  openReviewModal: (id: number) => void;
}

export default function UserOrderCard({
  order,
  openReviewModal,
}: UserOrderCardProps) {
  return (
    <div className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-50">
        <div>
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
            <Clock size={12} />{" "}
            {new Date(order.created_at).toLocaleString("id-ID")}
          </p>
          <h3 className="font-bold text-slate-900 text-lg">
            Order {formatOrderNumber(order.id)}
          </h3>
          <p className="text-sm font-semibold text-[#c94430] capitalize mt-0.5">
            {order.order_type.replace("_", " ")}{" "}
            {order.table_number && ` • Meja ${order.table_number}`}
          </p>
        </div>

        <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
          <p className="font-bold text-lg text-slate-900 mt-2">
            {formatCurrency(order.total_amount)}
          </p>

          {order.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openReviewModal(order.id)}
              className="mt-2 text-xs font-bold text-orange-600 border-orange-200 hover:bg-orange-50 rounded-lg h-8"
            >
              <Star size={14} className="mr-1.5 fill-current" /> Beri Ulasan
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">
              <span className="font-bold text-slate-900 mr-2">
                {item.quantity}x
              </span>
              {item.menu?.name || "Menu Terhapus"}
            </span>
            <span className="text-slate-500 font-medium">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
