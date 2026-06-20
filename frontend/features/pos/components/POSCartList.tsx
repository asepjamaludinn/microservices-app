import { Receipt } from "lucide-react";
import POSCartItem from "./POSCartItem";

interface POSCartListProps {
  cart: any[];
  updateQuantity: (id: number, delta: number) => void;
  updateNotes: (id: number, notes: string) => void;
}

export default function POSCartList({
  cart,
  updateQuantity,
  updateNotes,
}: POSCartListProps) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Receipt size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-semibold">Pesanan masih kosong</p>
        <p className="text-xs mt-1">Pilih menu dari katalog di sebelah kiri.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {cart.map((item) => (
        <POSCartItem
          key={item.menu.id}
          item={item}
          updateQuantity={updateQuantity}
          updateNotes={updateNotes}
        />
      ))}
    </div>
  );
}
