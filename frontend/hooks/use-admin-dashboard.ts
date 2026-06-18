"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData, DashboardOrder } from "@/types/dashboard";
import {
  getDashboardAnalytics,
  getRecentDashboardOrders,
} from "@/services/dashboard.service";

export function useAdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [analyticsData, ordersData] = await Promise.all([
          getDashboardAnalytics(),
          getRecentDashboardOrders(4),
        ]);

        setAnalytics(analyticsData);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error("Gagal memuat dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    analytics,
    recentOrders,
    loading,
  };
}
