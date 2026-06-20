"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  LogOut,
  ReceiptText,
  Utensils,
  Star,
  MessageSquare,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserDashboard } from "@/hooks/use-user-dashboard";
import { formatCurrency, formatOrderNumber } from "@/utils/order-formatters";
import { createReview } from "@/services/reviews.service";
import { useCartStore } from "@/store/useCartStore";

// Komponen dari Landing Page
import Hero from "@/components/home/Hero";
import StripeBanner from "@/components/home/StripeBanner";
import MenuList from "@/components/home/MenuList";
import Features from "@/components/home/Features";
import Footer from "@/components/layouts/users/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

// Utility untuk mengambil Inisial Nama
function getInitials(name?: string) {
  if (!name) return "US";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function UserDashboardFeature() {
  const { user, orders, loading, handleLogout } = useUserDashboard();
  const { cart, setIsCartOpen } = useCartStore();

  const [activeSection, setActiveSection] = useState<"home" | "orders">("home");

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
  }>({ isOpen: false, orderId: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openReviewModal = (orderId: number) => {
    setRating(5);
    setComment("");
    setReviewModal({ isOpen: true, orderId });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, orderId: null });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal.orderId || !user?.name) return;

    setIsSubmitting(true);
    try {
      await createReview({
        order_id: reviewModal.orderId,
        customer_name: user.name, // TS Payload, diabaikan dengan aman oleh Backend
        rating,
        comment,
      });
      toast.success("Terima kasih! Ulasan Anda berhasil dikirim.");
      closeReviewModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="w-8 h-8 border-4 border-[#c94430] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans selection:bg-[#c94430] selection:text-white flex flex-col">
      {/* NAVBAR CUSTOM UNTUK USER LOGIN */}
      <nav className="sticky top-0 w-full bg-[#FFFDF9]/90 backdrop-blur-md z-40 border-b border-orange-900/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div
            className="relative w-36 h-12 cursor-pointer transition-transform active:scale-95"
            onClick={() => setActiveSection("home")}
          >
            <Image
              src="/images/logo.png"
              alt="BiteBox Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="flex items-center gap-5 sm:gap-8">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-800 hover:text-[#c94430] transition-colors"
              aria-label="Buka keranjang"
            >
              <ShoppingCart size={28} strokeWidth={2.5} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#c94430] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FFFDF9]">
                  {cart.length}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 outline-none group cursor-pointer">
                <div className="w-11 h-11 bg-[#c94430] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-[#c94430]/20 transition-transform group-active:scale-95">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {user?.name || "Customer"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {user?.email || "User Account"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className="text-slate-400 hidden sm:block transition-transform group-data-[state=open]:rotate-180"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 rounded-2xl p-2 bg-white shadow-xl border-slate-100 z-50"
              >
                <DropdownMenuItem
                  onClick={() => setActiveSection("home")}
                  className="cursor-pointer rounded-xl font-semibold py-2.5 px-3 focus:bg-orange-50 focus:text-[#c94430]"
                >
                  <Utensils className="mr-2 h-4 w-4" /> Menu Makanan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveSection("orders")}
                  className="cursor-pointer rounded-xl font-semibold py-2.5 px-3 focus:bg-orange-50 focus:text-[#c94430]"
                >
                  <ReceiptText className="mr-2 h-4 w-4" /> Riwayat Pesanan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-slate-100 mx-2" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl text-red-600 focus:text-red-700 focus:bg-red-50 font-semibold py-2.5 px-3"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {activeSection === "home" ? (
          <div className="animate-in fade-in duration-500">
            <Hero />
            <StripeBanner />
            <MenuList />
            <Features />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#c94430] rounded-3xl p-8 text-white shadow-md mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Riwayat Pesanan
                </h1>
                <p className="text-white/80">
                  Lacak status pesanan dan berikan ulasan untuk hidangan favorit
                  Anda.
                </p>
              </div>
              <div className="absolute right-[-5%] top-[-20%] text-white/10">
                <ReceiptText size={180} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ReceiptText size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">
                    Anda belum memiliki riwayat pesanan.
                  </p>
                  <Button
                    onClick={() => setActiveSection("home")}
                    variant="link"
                    className="mt-2 text-[#c94430] font-bold"
                  >
                    Pesan Sekarang
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
                    >
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
                            {order.table_number &&
                              ` • Meja ${order.table_number}`}
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
                              <Star size={14} className="mr-1.5 fill-current" />{" "}
                              Beri Ulasan
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
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
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />

      {/* REVIEW MODAL */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-xl text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="text-[#c94430]" size={20} /> Beri Ulasan
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Bagaimana pengalaman Anda untuk Order{" "}
              {formatOrderNumber(reviewModal.orderId!)}?
            </p>

            <form onSubmit={submitReview} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= rating
                            ? "text-yellow-400 fill-current drop-shadow-sm"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Komentar
                </label>
                <Textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalaman rasa masakan atau pelayanan kami..."
                  className="rounded-xl min-h-[100px] bg-slate-50 border-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeReviewModal}
                  className="flex-1 rounded-xl h-11 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 bg-[#c94430] hover:bg-[#b03a28] text-white font-bold"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
