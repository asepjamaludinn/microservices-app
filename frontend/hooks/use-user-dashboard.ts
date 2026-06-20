"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { getMyOrders } from "@/services/user-dashboard.service";
import { getCurrentUser, type CurrentUser } from "@/services/auth.service";
import { useLogout } from "@/hooks/use-logout";

export function useUserDashboard() {
  const router = useRouter();
  const { handleLogout } = useLogout("/login");

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

  return {
    user,
    orders,
    loading,
    handleLogout,
  };
}
