"use client";

import Image from "next/image";
import { ShoppingCart, X, Utensils, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCheckoutAuth } from "@/hooks/use-checkout-auth";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, getSubtotal } =
    useCartStore();

  const { handleCheckout } = useCheckoutAuth();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <ShoppingCart className="text-[#c94430]" />
            Pesanan Saya
          </h2>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-full shadow-sm"
            aria-label="Tutup keranjang"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p className="font-semibold">Keranjang masih kosong</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.menu.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    {item.menu.image_url ? (
                      <Image
                        src={item.menu.image_url}
                        alt={item.menu.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Utensils size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 leading-tight mb-1">
                      {item.menu.name}
                    </h4>

                    <p className="text-sm font-bold text-[#c94430] mb-3">
                      Rp {Number(item.menu.price).toLocaleString("id-ID")}
                    </p>

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 w-max">
                      <button
                        onClick={() => updateQuantity(item.menu.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm hover:text-red-500"
                        aria-label="Kurangi jumlah"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                      </button>

                      <span className="w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.menu.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-[#c94430] rounded-md text-white shadow-sm hover:bg-[#b03a28]"
                        aria-label="Tambah jumlah"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-semibold">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={() => handleCheckout(() => setIsCartOpen(false))}
              className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#c94430]/30 transition-transform active:scale-95"
            >
              Checkout Sekarang
            </button>
          </div>
        )}
      </div>
    </>
  );
}
