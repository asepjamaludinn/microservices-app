"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { getMyOrders } from "@/services/user-dashboard.service";
import {
  getCurrentUser,
  logoutUser,
  type CurrentUser,
} from "@/services/auth.service";

export function useUserDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const userResponse = await getCurrentUser();
        setUser(userResponse.user);

        const userOrders = await getMyOrders();
        setOrders(userOrders);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return {
    user,
    orders,
    loading,
    handleLogout,
  };
}
