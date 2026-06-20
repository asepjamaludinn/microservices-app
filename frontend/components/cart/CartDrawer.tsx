"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  X,
  Utensils,
  Minus,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCheckoutAuth } from "@/hooks/use-checkout-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  createOrder,
  type CreateOrderPayload,
} from "@/services/orders.service";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    getSubtotal,
    clearCart,
  } = useCartStore();

  const { user } = useCurrentUser();
  const { handleCheckout } = useCheckoutAuth();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();

  const handleSubmitOrder = async () => {
    if (!user) {
      handleCheckout(() => setIsCartOpen(false));
      return;
    }

    if (cart.length === 0 || isSubmitting) return;

    if (deliveryAddress.trim() === "") {
      toast.error("Alamat pengiriman wajib diisi untuk pesanan online!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        customer_name: user.name || "Customer",
        order_type: "online",
        table_number: null,
        delivery_address: deliveryAddress,
        payment_method: "cash",
        items: cart.map((item) => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          notes: item.notes || null,
        })),
      };

      await createOrder(payload);

      clearCart?.();
      setDeliveryAddress("");
      setIsCartOpen(false);
      toast.success("Pesanan online berhasil dibuat! Menunggu kurir.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat pesanan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l-2 border-black bg-[#fff4dc] shadow-[-8px_0_0_#000] animate-in slide-in-from-right duration-300 sm:w-[430px]">
        <div className="border-b-2 border-black bg-[#cf432f] p-6 text-[#fff4dc]">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
              <ShoppingCart size={28} />
              Pesanan Online
            </h2>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black bg-[#fff4dc] text-slate-950 shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
            >
              <X size={21} strokeWidth={3} />
            </button>
          </div>

          <p className="mt-3 text-sm font-semibold text-[#fff4dc]/80">
            Pesanan ini akan diantar langsung ke lokasimu.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] border-2 border-black bg-white text-[#cf432f] shadow-[6px_6px_0_#000]">
                <ShoppingCart size={52} />
              </div>

              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">
                Keranjang Kosong
              </h3>

              <p className="mt-3 max-w-xs font-semibold leading-relaxed text-slate-600">
                Tambahkan menu favoritmu dulu sebelum melakukan checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <article
                  key={item.menu.id}
                  className="rounded-[1.5rem] border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-black bg-[#fff4dc]">
                      {item.menu.image_url ? (
                        <Image
                          src={item.menu.image_url}
                          alt={item.menu.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#cf432f]">
                          <Utensils size={26} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-lg font-black uppercase leading-tight text-slate-950">
                        {item.menu.name}
                      </h4>

                      <p className="mt-2 text-sm font-black text-[#cf432f]">
                        Rp {Number(item.menu.price).toLocaleString("id-ID")}
                      </p>

                      <div className="mt-4 flex w-max items-center rounded-xl border-2 border-black bg-[#fff4dc] p-1 shadow-[3px_3px_0_#000]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menu.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 transition hover:bg-red-50 hover:text-red-600"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 size={15} />
                          ) : (
                            <Minus size={15} />
                          )}
                        </button>
                        <span className="w-10 text-center text-sm font-black text-slate-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menu.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#cf432f] text-white transition hover:bg-[#b8321f]"
                        >
                          <Plus size={15} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t-2 border-black bg-white p-6 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase text-slate-700 flex items-center gap-1.5">
                <MapPin size={16} className="text-[#cf432f]" />
                Alamat Pengiriman
              </label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Patokan)..."
                className="w-full resize-none rounded-2xl border-2 border-black bg-slate-50 p-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf432f]/20 focus-visible:border-[#cf432f]"
              />
            </div>

            <div className="rounded-2xl border-2 border-black bg-[#fff4dc] p-5 shadow-[5px_5px_0_#000]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase text-slate-500">
                  Subtotal
                </span>
                <span className="text-2xl font-black text-slate-950">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitOrder}
              className="w-full rounded-2xl border-2 border-black bg-[#cf432f] py-4 text-lg font-black uppercase text-[#fff4dc] shadow-[6px_6px_0_#000] transition hover:-translate-y-1 hover:bg-[#b8321f] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Memproses..." : "Checkout Sekarang"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
