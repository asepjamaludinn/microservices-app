"use client";

import { useState } from "react";
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
  X,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTables } from "@/hooks/use-tables";
import type { TableStatus } from "@/types/table";
import { formatDateTime } from "@/utils/date-formatters";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: Array<{
  label: string;
  value: TableStatus | "all_statuses";
}> = [
  { label: "All Statuses", value: "all_statuses" },
  { label: "Available", value: "available" },
  { label: "In Use", value: "in_use" },
  { label: "Reserved", value: "reserved" },
  { label: "Maintenance", value: "maintenance" },
];

function TableStatusBadge({ status }: { status: TableStatus }) {
  const classNameMap: Record<TableStatus, string> = {
    available: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    in_use: "bg-slate-100 text-slate-500 border border-slate-200",
    reserved: "bg-blue-50 text-blue-600 border border-blue-100",
    maintenance: "bg-orange-50 text-orange-600 border border-orange-100",
  };

  const labelMap: Record<TableStatus, string> = {
    available: "Available",
    in_use: "In Use",
    reserved: "Reserved",
    maintenance: "Maintenance",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${classNameMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}

export default function TablesFeature() {
  const {
    processedTables,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterArea,
    setFilterArea,
    summary,
    uniqueAreas,
    changeStatus,
    addTable,
    removeTable,
  } = useTables();

  // State untuk Toast Notification
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // State untuk Custom Confirm Modal Delete
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // State untuk Modal Add Table
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: "",
    area: "",
    capacity: "",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addTable({
        table_number: newTable.table_number,
        area: newTable.area || "Main Area",
        capacity: Number(newTable.capacity) || 2,
      });
      showToast("Meja baru berhasil ditambahkan!", "success");
      setIsAddModalOpen(false);
      setNewTable({ table_number: "", area: "", capacity: "" });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Gagal menambahkan meja",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Meja Menggunakan Custom Modal
  const handleDelete = (id: number, number: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus",
      message: `Apakah Anda yakin ingin menghapus Meja ${number}? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await removeTable(id);
          showToast(`Meja ${number} berhasil dihapus.`, "success");
        } catch (error) {
          showToast(
            error instanceof Error ? error.message : "Gagal menghapus meja",
            "error",
          );
        }
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={cn(
            "fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-white",
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {toast.message}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              {confirmModal.message}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="rounded-xl font-bold flex-1 border-slate-200 text-white"
              >
                Batal
              </Button>
              <Button
                onClick={confirmModal.onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1 shadow-sm"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STATISTIK ATAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#ff5722] rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-32">
          <div className="absolute -right-4 -top-4 text-white/20">
            <Armchair size={80} />
          </div>
          <p className="font-medium text-white/90 z-10">Total Tables</p>
          <h2 className="text-4xl font-bold z-10">{summary.totalTables}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Occupied</p>
          <h2 className="text-4xl font-bold text-[#ff5722] text-right">
            {summary.occupied}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Reserved</p>
          <h2 className="text-4xl font-bold text-blue-600 text-right">
            {summary.reserved}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <p className="font-bold text-slate-700">Available</p>
          <h2 className="text-4xl font-bold text-emerald-600 text-right">
            {summary.available}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {/* HEADER TOOLBAR */}
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex gap-2"></div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Cari meja, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 min-w-[200px]"
              />
            </div>

            {/* FILTER CUSTOM MENGGUNAKAN SHADCN SELECT */}
            <div className="w-[160px]">
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as any)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white shadow-xl z-50">
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="py-2.5 cursor-pointer focus:bg-slate-50"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[160px]">
              <Select
                value={filterArea}
                onValueChange={(v) => setFilterArea(v)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white shadow-xl z-50">
                  <SelectItem
                    value="All Areas"
                    className="py-2.5 cursor-pointer focus:bg-slate-50"
                  >
                    All Areas
                  </SelectItem>
                  {uniqueAreas.map((area) => (
                    <SelectItem
                      key={area}
                      value={area}
                      className="py-2.5 cursor-pointer focus:bg-slate-50"
                    >
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold shadow-sm h-10"
            >
              <Plus size={16} className="mr-2" />
              Add Table
            </Button>
          </div>
        </div>

        {/* TABEL DATA */}
        {loading ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-12 ml-auto" />
            </div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-6 py-2">
                <div className="flex items-center gap-3 w-1/5">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-6 w-20 rounded-full w-1/6" />
                <div className="space-y-2 w-1/5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : processedTables.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <Armchair size={48} className="mb-3 opacity-30" />
            <p className="font-semibold">Tidak ada meja yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 font-semibold uppercase bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Area</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {processedTables.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c94430]/10 text-[#c94430] flex items-center justify-center">
                          <Armchair size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            Table {table.table_number}
                          </p>
                          <p className="text-xs text-slate-400">
                            {table.name || "No label"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Wine size={16} className="text-slate-400" />
                        {table.area}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {table.capacity}
                      </span>{" "}
                      <span className="text-slate-400">seats</span>
                    </td>

                    <td className="px-6 py-4">
                      <TableStatusBadge status={table.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDateTime(table.updated_at)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white rounded-2xl shadow-xl p-2 border-slate-100 z-50"
                        >
                          <DropdownMenuItem
                            onClick={() => changeStatus(table.id, "available")}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
                          >
                            <Check size={16} /> Set Available
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => changeStatus(table.id, "in_use")}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 focus:bg-slate-50 focus:text-slate-900 cursor-pointer transition-colors"
                          >
                            <Armchair size={16} /> Set In Use
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => changeStatus(table.id, "reserved")}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-blue-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer transition-colors"
                          >
                            <Calendar size={16} /> Set Reserved
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              changeStatus(table.id, "maintenance")
                            }
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-600 focus:bg-orange-50 focus:text-orange-700 cursor-pointer transition-colors"
                          >
                            <Wrench size={16} /> Set Maintenance
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1 bg-slate-100" />

                          <DropdownMenuItem
                            onClick={() =>
                              handleDelete(table.id, table.table_number)
                            }
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer transition-colors"
                          >
                            <Trash2 size={16} /> Hapus Meja
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH MEJA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Tambah Meja Baru
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Isi detail meja yang akan didaftarkan.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nomor Meja / ID
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Cth: 14 atau VIP-01"
                  value={newTable.table_number}
                  onChange={(e) =>
                    setNewTable({ ...newTable, table_number: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#c94430]/20 font-medium bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Area
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Cth: Indoor, Outdoor, VIP Lounge"
                  value={newTable.area}
                  onChange={(e) =>
                    setNewTable({ ...newTable, area: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#c94430]/20 font-medium bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kapasitas (Kursi)
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  placeholder="Cth: 4"
                  value={newTable.capacity}
                  onChange={(e) =>
                    setNewTable({ ...newTable, capacity: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#c94430]/20 font-medium bg-slate-50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 font-bold bg-[#c94430] hover:bg-[#b03a28] text-white shadow-sm"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Meja"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
