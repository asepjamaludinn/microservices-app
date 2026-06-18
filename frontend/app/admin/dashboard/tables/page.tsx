"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Check,
  Armchair,
  Wine,
  Wrench,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TableData = {
  id: number;
  table_number: string;
  name: string | null;
  area: string;
  capacity: number;
  status: "available" | "in_use" | "reserved" | "maintenance";
  updated_at: string;
};

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all_statuses");
  const [filterArea, setFilterArea] = useState("All Areas");

  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (res.ok && data.data) {
        setTables(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const changeStatus = async (id: number, newStatus: string) => {
    setActiveActionMenu(null);
    try {
      const res = await fetch(`/api/tables/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTables(); // Refresh data otomatis agar Date & Time ikut berubah
      }
    } catch (error) {
      alert("Gagal merubah status meja.");
    }
  };

  const createDummyTable = async () => {
    const dummy = {
      table_number: `T-${Math.floor(Math.random() * 100)}`,
      name: "Sliding Dinner",
      area: Math.random() > 0.5 ? "Outdoor#444" : "VIP Lounge", // Variasi area
      capacity: 4,
      status: "Available",
    };
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dummy),
    });
    fetchTables();
  };

  // Kalkulasi Summary Widgets
  const totalTables = tables.length;
  const occupied = tables.filter((t) => t.status === "in_use").length;
  const reserved = tables.filter((t) => t.status === "reserved").length;
  const available = tables.filter((t) => t.status === "available").length;

  // Ekstrak daftar area yang unik untuk dropdown
  const uniqueAreas = Array.from(new Set(tables.map((t) => t.area)));

  // Proses Filter Data (Search + Dropdown Filter)
  const processedTables = tables.filter((t) => {
    const matchSearch =
      t.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchStatus =
      filterStatus === "all_statuses" || t.status === filterStatus;
    const matchArea = filterArea === "All Areas" || t.area === filterArea;

    return matchSearch && matchStatus && matchArea;
  });

  // Helper untuk format tanggal
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
            Available
          </span>
        );
      case "in_use":
        return (
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
            In Use
          </span>
        );
      case "reserved":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            Reserved
          </span>
        );
      case "maintenance":
        return (
          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Header Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#ff5722] rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-32">
          <div className="absolute -right-4 -top-4 text-white/20">
            <Armchair size={80} />
          </div>
          <p className="font-medium text-white/90 z-10">Total Tables</p>
          <h2 className="text-4xl font-bold z-10">{totalTables}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Occupied</p>
          <h2 className="text-4xl font-bold text-[#ff5722] text-right">
            {occupied}
          </h2>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Reserved</p>
          <h2 className="text-4xl font-bold text-blue-600 text-right">
            {reserved}
          </h2>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Available</p>
          <h2 className="text-4xl font-bold text-emerald-600 text-right">
            {available}
          </h2>
        </div>
      </div>

      {/* 2. Main Data Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {/* Toolbar & Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="rounded-full text-slate-500 font-semibold px-5"
            >
              Real-time Status
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-[#c94430] border-[#c94430]/20 bg-white font-bold px-5 shadow-sm"
            >
              Table Configuration
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full md:w-56">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Search table or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-[#c94430]/20"
              />
            </div>

            {/* Status Dropdown Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none h-10 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#c94430]/20 cursor-pointer"
              >
                <option value="all_statuses">All Statuses</option>
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Area Dropdown Filter */}
            <div className="relative">
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="appearance-none h-10 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#c94430]/20 cursor-pointer"
              >
                <option value="All Areas">All Areas</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            <Button
              onClick={createDummyTable}
              className="h-10 rounded-xl bg-white border border-[#c94430] text-[#c94430] hover:bg-[#c94430]/5 font-bold shadow-sm"
            >
              <Plus size={16} className="mr-2" /> New Table
            </Button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c94430] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 font-semibold uppercase bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Table Number</th>
                  <th className="px-6 py-4">Table Name</th>
                  <th className="px-6 py-4">Area No.</th>
                  <th className="px-6 py-4">Date & Time</th>{" "}
                  {/* <-- KOLOM BARU SESUAI DESAIN */}
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {processedTables.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {table.table_number}
                    </td>
                    <td className="px-6 py-4">{table.name || "-"}</td>
                    <td className="px-6 py-4">{table.area}</td>
                    <td className="px-6 py-4 flex items-center gap-1.5 whitespace-nowrap text-slate-500">
                      <Clock size={14} /> {formatDateTime(table.updated_at)}{" "}
                      {/* <-- FORMAT WAKTU DI SINI */}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(table.status)}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg border-slate-200 hover:bg-slate-100"
                        onClick={() =>
                          setActiveActionMenu(
                            activeActionMenu === table.id ? null : table.id,
                          )
                        }
                      >
                        <MoreHorizontal size={16} />
                      </Button>

                      {activeActionMenu === table.id && (
                        <div className="absolute right-10 top-10 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 text-left">
                          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Ubah Status
                          </p>
                          <button
                            onClick={() => changeStatus(table.id, "available")}
                            className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-slate-50 flex items-center font-semibold"
                          >
                            <Check size={14} className="mr-2" /> Available
                          </button>
                          <button
                            onClick={() => changeStatus(table.id, "in_use")}
                            className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center font-semibold"
                          >
                            <Wine size={14} className="mr-2" /> In Use
                          </button>
                          <button
                            onClick={() => changeStatus(table.id, "reserved")}
                            className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 flex items-center font-semibold"
                          >
                            <Calendar size={14} className="mr-2" /> Reserved
                          </button>
                          <button
                            onClick={() =>
                              changeStatus(table.id, "maintenance")
                            }
                            className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-slate-50 flex items-center font-semibold"
                          >
                            <Wrench size={14} className="mr-2" /> Maintenance
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {processedTables.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Armchair size={48} className="opacity-20" />
                <p className="font-medium">
                  Tidak ada meja yang sesuai dengan filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
