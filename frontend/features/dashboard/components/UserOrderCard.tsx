import { Clock, Star, Utensils, ReceiptText } from "lucide-react";
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
    <article className="rounded-[1.75rem] border-2 border-black bg-[#fff4dc] p-5 shadow-[6px_6px_0_#000] transition duration-300 hover:-translate-y-1">
      <div className="mb-5 flex flex-col gap-5 border-b-2 border-dashed border-black/30 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-[#cf432f] text-[#fff4dc] shadow-[4px_4px_0_#000]">
            <ReceiptText size={28} />
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-500">
              <Clock size={13} />
              {new Date(order.created_at).toLocaleString("id-ID")}
            </p>

            <h3 className="text-2xl font-black uppercase leading-none tracking-tighter text-slate-950">
              Order {formatOrderNumber(order.id)}
            </h3>

            <p className="mt-2 text-sm font-black uppercase text-[#cf432f]">
              {order.order_type.replace("_", " ")}
              {order.table_number && ` • Meja ${order.table_number}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="rounded-2xl border-2 border-black bg-white px-5 py-3 text-right shadow-[4px_4px_0_#000]">
            <p className="text-xs font-black uppercase text-slate-500">Total</p>
            <p className="text-xl font-black text-slate-950">
              {formatCurrency(order.total_amount)}
            </p>
          </div>

          {order.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openReviewModal(order.id)}
              className="h-10 rounded-xl border-2 border-black bg-[#ffdc65] px-4 text-xs font-black uppercase text-slate-950 shadow-[4px_4px_0_#000] hover:bg-[#ffd23f]"
            >
              <Star size={15} className="mr-1.5 fill-current" />
              Beri Ulasan
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#cf432f]/10 text-[#cf432f]">
                <Utensils size={17} />
              </div>

              <p className="truncate text-sm font-bold text-slate-800">
                <span className="mr-2 font-black text-slate-950">
                  {item.quantity}x
                </span>
                {item.menu?.name || "Menu Terhapus"}
              </p>
            </div>

            <span className="shrink-0 text-sm font-black text-slate-950">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
