"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Utensils,
  X,
  Receipt,
  CreditCard,
  Calendar,
  Clock,
  User,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderItem = {
  id: number;
  menu: { name: string; image_url?: string };
  quantity: number;
  price: string;
  subtotal: string;
  notes: string | null;
};

type Order = {
  id: number;
  customer_name: string;
  table_number: string | null;
  order_type: "dine_in" | "takeaway";
  status: "pending" | "cooking" | "ready" | "completed" | "cancelled";
  payment_method: string;
  payment_status: "unpaid" | "paid" | "refunded";
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
};

const TABS = ["All", "On Process", "Completed", "Canceled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const [selectedOrder, setSelectedMenu] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?page=${page}&per_page=20`);
      const responseData = await res.json();
      if (res.ok && responseData.data) {
        const ordersArray = Array.isArray(responseData.data)
          ? responseData.data
          : responseData.data.data;
        setOrders(ordersArray);

        if (responseData.data.last_page) {
          setTotalPages(responseData.data.last_page);
          setCurrentPage(responseData.data.current_page);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status Order (Memasak/Selesai)
  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string,
  ) => {
    const confirmUpdate = window.confirm(
      `Ubah status Order #ORD${orderId.toString().padStart(4, "0")} menjadi ${newStatus.toUpperCase()}?`,
    );
    if (!confirmUpdate) return;

    setIsProcessingAction(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("Status pesanan berhasil diperbarui!");
        fetchOrders(currentPage);
        if (selectedOrder && selectedOrder.id === orderId)
          setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Gagal memproses pesanan: ${errData.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Update Payment Status (Bayar)
  const handlePayBill = async (orderId: number) => {
    const confirmPay = window.confirm(
      `Konfirmasi pelunasan untuk Order #ORD${orderId.toString().padStart(4, "0")}?`,
    );
    if (!confirmPay) return;

    setIsProcessingAction(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "paid" }),
      });

      if (res.ok) {
        alert("Pembayaran berhasil diverifikasi!");
        fetchOrders(currentPage);
        if (selectedOrder && selectedOrder.id === orderId)
          setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Gagal memproses pembayaran: ${errData.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Fungsi Cetak Struk (Membuka Window Baru)
  const handlePrintReceipt = (order: Order) => {
    const receiptContent = `
      <html>
        <head>
          <title>Receipt #ORD${order.id.toString().padStart(4, "0")}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .item-name { flex: 1; }
            .item-qty { margin: 0 10px; }
            .totals { margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>BiteBox Restaurant</h2>
            <p>Order #ORD${order.id.toString().padStart(4, "0")}</p>
            <p>${formatDate(order.created_at)} ${formatTime(order.created_at)}</p>
            <p>Customer: ${order.customer_name}</p>
            <p>Type: ${order.order_type.replace("_", " ").toUpperCase()} ${order.table_number ? `- Table ${order.table_number}` : ""}</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="items">
            ${order.items
              .map(
                (item) => `
              <div class="item">
                <span class="item-name">${item.menu.name}</span>
                <span class="item-qty">x${item.quantity}</span>
                <span>Rp ${Number(item.subtotal).toLocaleString("id-ID")}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="divider"></div>
          
          <div class="totals">
            <div class="item">
              <span>Subtotal:</span>
              <span>Rp ${Number(order.subtotal).toLocaleString("id-ID")}</span>
            </div>
            <div class="item">
              <span>Tax (11%):</span>
              <span>Rp ${Number(order.tax_amount).toLocaleString("id-ID")}</span>
            </div>
            <div class="divider"></div>
            <div class="total-row">
              <span>TOTAL:</span>
              <span>Rp ${Number(order.total_amount).toLocaleString("id-ID")}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            <p>Paid via ${order.payment_method.toUpperCase()}</p>
            <p>Status: ${order.payment_status.toUpperCase()}</p>
            <br/>
            <p>Thank you for dining with us!</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "On Process")
      return ["pending", "cooking", "ready"].includes(order.status);
    if (activeTab === "Completed") return order.status === "completed";
    if (activeTab === "Canceled") return order.status === "cancelled";
    return true;
  });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const openDetails = (order: Order) => {
    setSelectedMenu(order);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMenu(null), 200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
            ✓ Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
            ✕ Cancelled
          </span>
        );
      case "ready":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            ◉ Ready to Serve
          </span>
        );
      case "cooking":
        return (
          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
            ⟳ Cooking
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
            ⏳ Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            PAID
          </span>
        );
      case "refunded":
        return (
          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            REFUNDED
          </span>
        );
      default:
        return (
          <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            UNPAID
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-slate-100 w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? "bg-[#c94430] text-white shadow-md" : "text-slate-500 hover:text-slate-900"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full w-10 h-10 p-0 border-slate-200 text-slate-500"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="outline"
            className="rounded-full w-10 h-10 p-0 border-slate-200 text-slate-500"
          >
            <SlidersHorizontal size={18} />
          </Button>
        </div>
      </div>

      {/* Grid Cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
          <p className="font-bold text-lg text-slate-600">
            Tidak ada pesanan di kategori ini.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold text-slate-400">
                      {formatDate(order.created_at)}
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {formatTime(order.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                  </div>
                </div>

                <div className="mb-6 border-t border-slate-50 pt-4">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {order.customer_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#c94430]">
                      #ORD{order.id.toString().padStart(4, "0")}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {order.table_number
                        ? `Dine-In • Meja ${order.table_number}`
                        : "Takeaway"}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">
                    Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </h4>
                  <div className="space-y-3 mb-6 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {item.quantity}x
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {item.menu.name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-red-500 font-medium truncate">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          Rp {Number(item.subtotal).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex justify-between items-end mb-5">
                    <span className="text-sm font-semibold text-slate-400">
                      Total Pembayaran
                    </span>
                    <span className="text-xl font-bold text-[#c94430]">
                      Rp {Number(order.total_amount).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => openDetails(order)}
                      variant="outline"
                      className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600 hover:text-slate-900"
                    >
                      Details
                    </Button>

                    {order.payment_status === "unpaid" &&
                      order.status !== "cancelled" && (
                        <Button
                          disabled={isProcessingAction}
                          onClick={() => handlePayBill(order.id)}
                          className="flex-1 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-500/20"
                        >
                          Pay Bill
                        </Button>
                      )}

                    {order.status !== "completed" &&
                      order.status !== "cancelled" &&
                      order.payment_status === "paid" && (
                        <Button
                          disabled={isProcessingAction}
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "completed")
                          }
                          className="flex-1 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20"
                        >
                          Set Completed
                        </Button>
                      )}

                    {order.status === "completed" &&
                      order.payment_status === "paid" && (
                        <Button
                          onClick={() => handlePrintReceipt(order)}
                          className="flex-1 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                        >
                          <Printer size={16} className="mr-2" /> Print
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border-slate-200"
              >
                Previous
              </Button>
              <span className="text-sm font-semibold text-slate-500">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border-slate-200"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* MODAL POP-UP DETAIL INVOICE PESANAN */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c94430]/10 flex items-center justify-center text-[#c94430]">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                    Nota #ORD{selectedOrder.id.toString().padStart(4, "0")}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-semibold capitalize">
                      {selectedOrder.order_type.replace("_", " ")}
                    </span>
                    • {getStatusBadge(selectedOrder.status)}
                    {getPaymentBadge(selectedOrder.payment_status)}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={16} /> <span>{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 justify-end">
                  <CreditCard size={16} />{" "}
                  <span className="capitalize font-bold text-slate-800">
                    {selectedOrder.payment_method}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Calendar size={14} />{" "}
                  <span>{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs justify-end">
                  <Clock size={14} />{" "}
                  <span>{formatTime(selectedOrder.created_at)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Daftar Menu
                </p>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl p-3 bg-white">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2 flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-bold text-slate-800">
                          {item.menu.name}{" "}
                          <span className="text-[#c94430] ml-1">
                            x{item.quantity}
                          </span>
                        </p>
                        {item.notes && (
                          <p className="text-xs text-red-500 mt-0.5 font-medium">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-slate-900">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2 text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">
                    Rp {Number(selectedOrder.subtotal).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PPN (11%)</span>
                  <span className="text-slate-800">
                    Rp{" "}
                    {Number(selectedOrder.tax_amount).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 mt-1 border-t border-dashed border-slate-300">
                  <span>Total Transaksi</span>
                  <span className="text-[#c94430]">
                    Rp{" "}
                    {Number(selectedOrder.total_amount).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="rounded-xl font-semibold border-slate-200"
              >
                Tutup
              </Button>
              {selectedOrder.payment_status === "unpaid" &&
                selectedOrder.status !== "cancelled" && (
                  <Button
                    disabled={isProcessingAction}
                    onClick={() => handlePayBill(selectedOrder.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold px-6"
                  >
                    Verifikasi Pembayaran
                  </Button>
                )}
              {selectedOrder.status === "completed" &&
                selectedOrder.payment_status === "paid" && (
                  <Button
                    onClick={() => handlePrintReceipt(selectedOrder)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold px-6 shadow-sm shadow-emerald-500/20"
                  >
                    <Printer size={16} className="mr-2" /> Cetak Struk
                  </Button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
