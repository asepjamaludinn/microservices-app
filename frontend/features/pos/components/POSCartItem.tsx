import { Trash2, Minus, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface POSCartItemProps {
  item: any;
  updateQuantity: (id: number, delta: number) => void;
  updateNotes: (id: number, notes: string) => void;
}

export default function POSCartItem({
  item,
  updateQuantity,
  updateNotes,
}: POSCartItemProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-3">
          <h4 className="text-sm font-bold text-slate-800 leading-tight">
            {item.menu.name}
          </h4>
          <p className="text-xs text-[#c94430] font-semibold mt-1">
            Rp {Number(item.menu.price).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm font-bold text-slate-900">
            Rp{" "}
            {(Number(item.menu.price) * item.quantity).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Textarea
          placeholder="Catatan (opsional)..."
          value={item.notes || ""}
          onChange={(e) => updateNotes(item.menu.id, e.target.value)}
          className="min-h-[40px] text-xs py-2 px-3 rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430]"
        />

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0 h-10">
          <button
            type="button"
            onClick={() => updateQuantity(item.menu.id, -1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm cursor-pointer hover:text-red-500 transition-colors"
          >
            {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
          </button>
          <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.menu.id, 1)}
            className="w-8 h-8 flex items-center justify-center bg-[#c94430] rounded-md text-white shadow-sm cursor-pointer hover:bg-[#b03a28] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
