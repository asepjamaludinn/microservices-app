"use client";

import { useEffect, useState } from "react";
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  id: number;
  menu: { name: string };
  quantity: number;
  notes: string | null;
};

type Order = {
  id: number;
  customer_name: string;
  table_number: string | null;
  status: "pending" | "cooking" | "ready" | "completed" | "cancelled";
  created_at: string;
  items: OrderItem[];
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchActiveOrders = async () => {
    try {
      // Mengirim param paginate=false agar Dapur melihat SEMUA antrean
      const res = await fetch("/api/orders?paginate=false");
      if (!res.ok) {
        console.error("Gagal mengambil order:", res.status);
        return;
      }
      const responseData = await res.json();

      if (res.ok && responseData.data) {
        const ordersArray = Array.isArray(responseData.data)
          ? responseData.data
          : responseData.data.data;

        const activeOrders = ordersArray.filter(
          (o: Order) => o.status === "pending" || o.status === "cooking",
        );
        const sortedOrders = activeOrders.sort(
          (a: Order, b: Order) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

        setOrders(sortedOrders);
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh setiap 10 detik agar Koki tidak perlu manual refresh
  useEffect(() => {
    fetchActiveOrders();
    const intervalId = setInterval(fetchActiveOrders, 10000);
    return () => clearInterval(intervalId); // Cleanup saat pindah halaman
  }, []);

  // Fungsi mengubah status (Pending -> Cooking -> Ready)
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH", // Sesuai dengan route Laravel kita
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh data setelah update sukses
        fetchActiveOrders();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat update status.");
    }
  };

  // Utility untuk menghitung berapa menit pesanan sudah menunggu
  const getWaitingTime = (createdAt: string) => {
    const diffMs = new Date().getTime() - new Date(createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  return (
    <div className="space-y-6">
      {/* Header Dapur */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between border-l-4 border-l-[#c94430]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#c94430]/10 text-[#c94430] rounded-2xl flex items-center justify-center">
            <ChefHat size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Kitchen Display
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Pesanan aktif yang harus segera disiapkan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold text-slate-400">
            Terakhir diupdate: {lastUpdated.toLocaleTimeString("id-ID")}
          </p>
          <Button
            onClick={fetchActiveOrders}
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-600 hover:text-primary"
          >
            <RefreshCcw size={16} className="mr-2" /> Segarkan
          </Button>
        </div>
      </div>

      {/* Grid Pesanan (Kanban Style) */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col h-64 items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <CheckCircle2
            size={48}
            className="mb-4 opacity-20 text-emerald-500"
          />
          <p className="font-bold text-lg text-slate-600">Dapur Bersih!</p>
          <p className="text-sm">Tidak ada antrean pesanan saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4">
          {orders.map((order) => {
            const waitTime = getWaitingTime(order.created_at);
            const isLate = waitTime > 20; // Peringatan merah jika lebih dari 20 menit

            return (
              <div
                key={order.id}
                className={`bg-white border flex flex-col shadow-sm rounded-3xl overflow-hidden transition-all ${
                  isLate ? "border-red-200 shadow-red-100" : "border-slate-200"
                }`}
              >
                {/* Ticket Header */}
                <div
                  className={`p-4 flex items-center justify-between border-b ${
                    order.status === "cooking"
                      ? "bg-orange-50 border-orange-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-none mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {order.customer_name}
                      {order.table_number
                        ? ` • Meja ${order.table_number}`
                        : " • Takeaway"}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isLate
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Clock size={14} /> {waitTime} mnt
                  </div>
                </div>

                {/* Ticket Body (Daftar Masakan) */}
                <div className="p-5 flex-1">
                  <ul className="space-y-4">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm flex-shrink-0">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base leading-tight">
                            {item.menu.name}
                          </p>
                          {item.notes && (
                            <p className="text-sm font-medium text-red-500 mt-0.5 bg-red-50 px-2 py-0.5 rounded inline-block border border-red-100">
                              Catatan: {item.notes}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ticket Action Buttons */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  {order.status === "pending" ? (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "cooking")}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-orange-500/20"
                    >
                      <Flame size={20} className="mr-2" /> Mulai Masak
                    </Button>
                  ) : (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 size={20} className="mr-2" /> Siap
                      Disajikan!
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
