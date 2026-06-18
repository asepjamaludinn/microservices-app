"use client";

import { useEffect, useMemo, useState } from "react";
import type { RestaurantTable, TableStatus } from "@/types/table";
import {
  createTable,
  getTables,
  updateTableStatus,
  deleteTable as apiDeleteTable,
} from "@/services/tables.service";

export function useTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    TableStatus | "all_statuses"
  >("all_statuses");
  const [filterArea, setFilterArea] = useState("All Areas");
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
    } catch (err) {
      console.error(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const changeStatus = async (id: number, status: TableStatus) => {
    setActiveActionMenu(null);
    try {
      await updateTableStatus(id, status);
      await fetchTables();
    } catch {
      alert("Gagal merubah status meja.");
    }
  };

  // Fungsi baru untuk menerima data input form
  const addTable = async (payload: {
    table_number: string;
    area: string;
    capacity: number;
  }) => {
    await createTable({
      ...payload,
      name: `Table ${payload.table_number}`,
      status: "available",
    });
    await fetchTables();
  };

  // Fungsi baru untuk menghapus meja
  const removeTable = async (id: number) => {
    setActiveActionMenu(null);
    await apiDeleteTable(id);
    await fetchTables();
  };

  const summary = useMemo(() => {
    return {
      totalTables: tables.length,
      occupied: tables.filter((table) => table.status === "in_use").length,
      reserved: tables.filter((table) => table.status === "reserved").length,
      available: tables.filter((table) => table.status === "available").length,
    };
  }, [tables]);

  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(tables.map((table) => table.area)));
  }, [tables]);

  const processedTables = useMemo(() => {
    return tables.filter((table) => {
      const search = searchQuery.toLowerCase();

      const matchSearch =
        table.table_number.toLowerCase().includes(search) ||
        table.area.toLowerCase().includes(search) ||
        (table.name?.toLowerCase() || "").includes(search);

      const matchStatus =
        filterStatus === "all_statuses" || table.status === filterStatus;
      const matchArea = filterArea === "All Areas" || table.area === filterArea;

      return matchSearch && matchStatus && matchArea;
    });
  }, [tables, searchQuery, filterStatus, filterArea]);

  return {
    tables,
    processedTables,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterArea,
    setFilterArea,
    activeActionMenu,
    setActiveActionMenu,
    summary,
    uniqueAreas,
    fetchTables,
    changeStatus,
    addTable,
    removeTable,
  };
}
