"use client";

import { useEffect, useState } from "react";
import type { Menu } from "@/types/menu";
import { getPublicMenus } from "@/services/public-menus.service";

export function usePublicMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const data = await getPublicMenus();
        setMenus(data || []);
      } catch {
        setMenus([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();
  }, []);

  return {
    menus,
    loading,
  };
}
