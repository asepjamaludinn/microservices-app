import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation"; // TAMBAHKAN INI
import type { Order, OrderStatus } from "@/types/order";
import { filterOrdersByTab, type OrderTab } from "@/utils/order-formatters";
import {
  getOrders,
  payOrderBill,
  updateOrderStatus,
} from "@/services/orders.service";

export function useAdminOrders() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderTab>("All");
  const [loading, setLoading] = useState(true);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const fetchOrders = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders(page, 20, search);

      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data pesanan.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(1, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchOrders]);

  const filteredOrders = useMemo(() => {
    return filterOrdersByTab(orders, activeTab);
  }, [orders, activeTab]);

  const changeOrderStatus = async (orderId: number, status: OrderStatus) => {
    setIsProcessingAction(true);
    try {
      await updateOrderStatus(orderId, status);
      await fetchOrders(currentPage, searchQuery);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const payBill = async (orderId: number, amountPaid: number) => {
    setIsProcessingAction(true);
    try {
      await payOrderBill(orderId, amountPaid);
      await fetchOrders(currentPage, searchQuery);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return {
    orders,
    filteredOrders,
    activeTab,
    setActiveTab,
    loading,
    error,
    isProcessingAction,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    fetchOrders,
    changeOrderStatus,
    payBill,
  };
}
