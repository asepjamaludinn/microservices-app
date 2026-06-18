"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { orderSchema, type OrderFormValues } from "@/schemas/order.schema";
import { useCartStore } from "@/store/useCartStore";
import { getInternalMenus } from "@/services/menus.service";
import { getTables } from "@/services/tables.service";
import {
  createOrder,
  type CreateOrderPayload,
} from "@/services/orders.service";
import type { Menu } from "@/types/menu";
import type { RestaurantTable } from "@/types/table";

export function usePOS() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartStore = useCartStore();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      orderType: "dine_in",
      tableNumber: "",
      paymentMethod: "cash",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [menusData, tablesData] = await Promise.all([
          getInternalMenus(),
          getTables(),
        ]);
        setMenus(menusData);
        setTables(tablesData.filter((t) => t.status === "available"));
      } catch {
        setMenus([]);
        setTables([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) =>
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [menus, searchQuery]);

  const onSubmit = async (values: OrderFormValues) => {
    if (cartStore.cart.length === 0) {
      toast.error("Keranjang kosong! Silakan pilih menu terlebih dahulu.");
      return;
    }

    const payload: CreateOrderPayload = {
      customer_name: values.customerName,
      order_type: values.orderType,
      table_number:
        values.orderType === "takeaway" ? null : values.tableNumber || null,
      payment_method: values.paymentMethod,
      items: cartStore.cart.map((item) => ({
        menu_id: item.menu.id,
        quantity: item.quantity,
        notes: item.notes || null,
      })),
    };

    setIsSubmitting(true);

    try {
      await createOrder(payload);
      cartStore.clearCart();
      form.reset();

      const newTables = await getTables();
      setTables(newTables.filter((t) => t.status === "available"));

      toast.success("Pesanan berhasil diproses!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal membuat pesanan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    menus: filteredMenus,
    tables,
    loading,
    searchQuery,
    setSearchQuery,
    isSubmitting,
    form,
    onSubmit,
    cartStore,
  };
}
