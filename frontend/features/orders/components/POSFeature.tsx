"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Utensils,
  ShoppingBag,
  User,
  MapPin,
  Banknote,
  SmartphoneNfc,
  CreditCard,
  Minus,
  Plus,
  Trash2,
  Receipt,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePOS } from "@/hooks/use-pos";
import type { Menu } from "@/types/menu";

export default function POSFeature() {
  const {
    menus,
    tables,
    loading,
    searchQuery,
    setSearchQuery,
    isSubmitting,
    form,
    onSubmit,
    cartStore,
  } = usePOS();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const orderType = watch("orderType");
  const tableNumber = watch("tableNumber");
  const paymentMethod = watch("paymentMethod");

  const subtotal = cartStore.getSubtotal();
  const taxAmount = subtotal * 0.11;
  const totalAmount = subtotal + taxAmount;

  // Custom Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleAddToCart = (menu: Menu) => {
    cartStore.addToCart(menu);
    showToast(`${menu.name} ditambahkan ke pesanan!`, "success");
  };

  const handleCheckoutSuccess = async (data: any) => {
    await onSubmit(data, showToast);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] relative">
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={cn(
            "fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-white",
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {toast.message}
        </div>
      )}

      {/* KIRI: KATALOG MENU */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
              className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] rounded-xl text-base"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col"
                >
                  <Skeleton className="h-28 w-full rounded-none" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAddToCart(menu)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAddToCart(menu);
                    }
                  }}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-[#c94430]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94430] transition-all group flex flex-col"
                >
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    {menu.image_url ? (
                      <Image
                        src={menu.image_url}
                        alt={menu.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Utensils size={24} />
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
                    <p className="text-sm font-bold text-slate-900 mt-3">
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
        onSubmit={handleSubmit(handleCheckoutSuccess)}
        className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-shrink-0"
      >
        <div className="p-5 border-b border-slate-100 bg-[#c94430] text-white rounded-t-3xl flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <ShoppingCart size={20} /> Order Saat Ini
          </h2>
          <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold">
            {cartStore.cart.length} Item
          </span>
        </div>

        <div className="p-5 border-b border-slate-100 space-y-4 bg-slate-50/50">
          {/* Order Type Toggle */}
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setValue("orderType", "dine_in")}
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
              onClick={() => {
                setValue("orderType", "takeaway");
                setValue("tableNumber", "");
              }}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
                orderType === "takeaway"
                  ? "bg-white shadow-sm text-[#c94430]"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <ShoppingBag size={16} /> Takeaway
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-slate-400 shrink-0" />
              <Input
                {...register("customerName")}
                placeholder="Nama Pelanggan *"
                className={`border-slate-200 h-10 text-sm rounded-xl focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] ${errors.customerName ? "border-red-500 focus-visible:ring-red-200" : ""}`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs font-medium text-red-500 mt-1.5 ml-7">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {orderType === "dine_in" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="relative w-full">
                {/* SELECT MENGGUNAKAN SHADCN UI (Portaled to body, bebas dari overflow) */}
                <Select
                  onValueChange={(value) =>
                    setValue("tableNumber", value, { shouldValidate: true })
                  }
                  defaultValue={tableNumber}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full h-10 rounded-xl px-3 bg-white focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] outline-none",
                      errors.tableNumber
                        ? "border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500"
                        : "border-slate-200",
                      !tableNumber && "text-slate-500 font-normal",
                    )}
                  >
                    <SelectValue placeholder="Pilih Meja Tersedia *" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {tables.length === 0 ? (
                      <div className="p-3 text-sm text-center text-slate-500">
                        Tidak ada meja tersedia
                      </div>
                    ) : (
                      tables.map((t) => (
                        <SelectItem
                          key={t.id}
                          value={t.table_number}
                          className="py-2.5"
                        >
                          <span className="font-semibold text-slate-800">
                            Meja {t.table_number}
                          </span>
                          <span className="text-slate-500 ml-1">
                            - {t.area} ({t.capacity} Kursi)
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <input type="hidden" {...register("tableNumber")} />
              </div>
            </div>
          )}
          {errors.tableNumber && orderType === "dine_in" && (
            <p className="text-xs font-medium text-red-500 mt-1.5 ml-7">
              {errors.tableNumber.message}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {cartStore.cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Receipt size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-semibold">Pesanan masih kosong</p>
              <p className="text-xs mt-1">
                Pilih menu dari katalog di sebelah kiri.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {cartStore.cart.map((item) => (
                <div key={item.menu.id} className="flex flex-col gap-3">
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
                        {(
                          Number(item.menu.price) * item.quantity
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Textarea
                      placeholder="Catatan (opsional)..."
                      value={item.notes || ""}
                      onChange={(e) =>
                        cartStore.updateNotes(item.menu.id, e.target.value)
                      }
                      className="min-h-[40px] text-xs py-2 px-3 rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430]"
                    />

                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0 h-10">
                      <button
                        type="button"
                        onClick={() =>
                          cartStore.updateQuantity(item.menu.id, -1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm cursor-pointer hover:text-red-500 transition-colors"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          cartStore.updateQuantity(item.menu.id, 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-[#c94430] rounded-md text-white shadow-sm cursor-pointer hover:bg-[#b03a28] transition-colors"
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

        <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl">
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>PPN (11%)</span>
              <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Bayar</span>
              <span className="text-[#c94430]">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 mb-2.5 uppercase tracking-wider">
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
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs cursor-pointer font-semibold transition-all ${
                    paymentMethod === method.id
                      ? "border-[#c94430] bg-[#c94430]/10 text-[#c94430] shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <method.icon size={20} strokeWidth={2.5} /> {method.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={cartStore.cart.length === 0 || isSubmitting}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white h-14 rounded-xl font-bold text-base shadow-lg shadow-[#c94430]/20 transition-all disabled:shadow-none"
          >
            {isSubmitting ? "Memproses..." : "Proses Pesanan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
