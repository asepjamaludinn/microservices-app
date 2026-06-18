"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types/order";
import {
  getKitchenOrders,
  updateKitchenOrderStatus,
} from "@/services/kitchen.service";

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchActiveOrders = async () => {
    try {
      const data = await getKitchenOrders();

      setOrders(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();

    const intervalId = setInterval(fetchActiveOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const changeToCooking = async (orderId: number) => {
    try {
      await updateKitchenOrderStatus(orderId, "cooking");
      await fetchActiveOrders();
    } catch {
      alert("Terjadi kesalahan jaringan saat update status.");
    }
  };

  const changeToReady = async (orderId: number) => {
    try {
      await updateKitchenOrderStatus(orderId, "ready");
      await fetchActiveOrders();
    } catch {
      alert("Terjadi kesalahan jaringan saat update status.");
    }
  };

  return {
    orders,
    loading,
    lastUpdated,
    fetchActiveOrders,
    changeToCooking,
    changeToReady,
  };
}
