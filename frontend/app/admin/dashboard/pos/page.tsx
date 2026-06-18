"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  MapPin,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  Receipt,
  Utensils,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";

// 1. Skema Validasi Zod (Diperbarui dengan orderType)
const orderSchema = z.object({
  customerName: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  orderType: z.enum(["dine_in", "takeaway"]),
  tableNumber: z.string().optional(),
  paymentMethod: z.enum(["cash", "qris", "card"]),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function PointOfSalePage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    cart,
    addToCart,
    updateQuantity,
    updateNotes,
    clearCart,
    getSubtotal,
  } = useCartStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      orderType: "dine_in", // Default Dine In
      tableNumber: "",
      paymentMethod: "cash",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const orderType = watch("orderType"); // Memantau tipe pesanan

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus/internal");
        const data = await res.json();
        if (res.ok && data.data) setMenus(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const subtotal = getSubtotal();
  const taxAmount = subtotal * 0.11;
  const totalAmount = subtotal + taxAmount;

  const onSubmit = async (values: OrderFormValues) => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");

    // Validasi Ekstra: Dine In butuh no meja (bisa opsional tergantung policy resto, kita buat peringatan saja)
    if (values.orderType === "dine_in" && !values.tableNumber) {
      const confirmNoTable = window.confirm(
        "Nomor meja kosong untuk pesanan Dine In. Tetap lanjutkan?",
      );
      if (!confirmNoTable) return;
    }

    setIsSubmitting(true);

    const payload = {
      customer_name: values.customerName,
      order_type: values.orderType,
      table_number:
        values.orderType === "takeaway" ? null : values.tableNumber || null,
      payment_method: values.paymentMethod,
      // Kita tambahkan catatan orderType di payload (opsional, jika backend belum siap menampung kolom ini, bisa kita gabung di nama atau abaikan dulu)
      // notes: `[${values.orderType.toUpperCase()}]`,
      items: cart.map((item) => ({
        menu_id: item.menu.id,
        quantity: item.quantity,
        notes: item.notes || null,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `Transaksi ${values.orderType === "dine_in" ? "Dine In" : "Takeaway"} Berhasil Diproses!`,
        );
        clearCart();
        reset(); // Reset form back to default
      } else {
        alert(`Gagal: ${data.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] relative">
      {/* KIRI: KATALOG MENU */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* ... Header Search (Sama seperti sebelumnya) ... */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] rounded-xl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenus.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => addToCart(menu)}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-[#c94430]/50 hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="h-28 bg-slate-100 relative">
                    {menu.image_url ? (
                      <img
                        src={menu.image_url}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#c94430] font-semibold mb-1 truncate">
                        {menu.category?.name}
                      </p>
                      <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                        {menu.name}
                      </h3>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-2">
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KANAN: KERANJANG & CHECKOUT FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-shrink-0"
      >
        <div className="p-5 border-b border-slate-100 bg-[#c94430] text-white rounded-t-3xl flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <ShoppingCart size={20} /> Order Saat Ini
          </h2>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-sm font-semibold">
            {cart.length} Item
          </span>
        </div>

        {/* Customer Details & Order Type */}
        <div className="p-5 border-b border-slate-100 space-y-4 bg-slate-50/50">
          {/* Order Type Toggle (BARU) */}
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setValue("orderType", "dine_in")}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                orderType === "dine_in"
                  ? "bg-white shadow-sm text-[#c94430]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Utensils size={16} /> Dine In
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("orderType", "takeaway");
                setValue("tableNumber", ""); // Hapus no meja jika takeaway
              }}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                orderType === "takeaway"
                  ? "bg-white shadow-sm text-[#c94430]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShoppingBag size={16} /> Takeaway
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-slate-400" />
              <Input
                {...register("customerName")}
                placeholder="Nama Pelanggan *"
                className={`border-slate-200 h-9 text-sm rounded-lg ${errors.customerName ? "border-red-500 focus-visible:ring-red-200" : ""}`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-red-500 mt-1 ml-7">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Sembunyikan Input Meja jika Takeaway */}
          {orderType === "dine_in" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <MapPin size={18} className="text-slate-400" />
              <Input
                {...register("tableNumber")}
                placeholder="Nomor Meja"
                className="border-slate-200 h-9 text-sm rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Cart Items (Sama seperti sebelumnya) */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Receipt size={48} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">Pesanan masih kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.menu.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {item.menu.name}
                      </h4>
                      <p className="text-xs text-[#c94430] font-semibold mt-0.5">
                        Rp {Number(item.menu.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 w-24 text-right">
                      Rp{" "}
                      {(Number(item.menu.price) * item.quantity).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Catatan..."
                      className="text-xs bg-slate-50 border border-slate-100 rounded-md px-2 py-1 w-32 outline-none focus:border-[#c94430]"
                      value={item.notes}
                      onChange={(e) =>
                        updateNotes(item.menu.id, e.target.value)
                      }
                    />
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.menu.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm hover:text-red-500 transition-colors"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.menu.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-[#c94430] rounded-md text-white shadow-sm hover:bg-[#b03a28] transition-colors"
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

        {/* Summary & Checkout (Sama seperti sebelumnya) */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>PPN (11%)</span>
              <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Bayar</span>
              <span className="text-[#c94430]">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Metode Pembayaran
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "cash", label: "Tunai", icon: Banknote },
                { id: "qris", label: "QRIS", icon: SmartphoneNfc },
                { id: "card", label: "Kartu", icon: CreditCard },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setValue("paymentMethod", method.id as any)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === method.id
                      ? "border-[#c94430] bg-[#c94430]/10 text-[#c94430]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <method.icon size={18} /> {method.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={cart.length === 0 || isSubmitting}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white py-6 rounded-xl font-bold text-base shadow-lg shadow-[#c94430]/20 transition-all"
          >
            {isSubmitting ? "Memproses..." : "Proses Pesanan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
