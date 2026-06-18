"use client";

import { useState, useEffect } from "react";
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

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
import { useReservations } from "@/hooks/use-reservations";
import { getTables } from "@/services/tables.service";
import { RestaurantTable } from "@/types/table";
import { formatDateTime } from "@/utils/date-formatters";

export default function ReservationsFeature() {
  const {
    reservations,
    loading,
    isProcessing,
    fetchReservations,
    addReservation,
    changeStatus,
  } = useReservations();

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    table_id: "",
    customer_name: "",
    contact_number: "",
    reservation_time: "",
    guest_count: "",
  });

  useEffect(() => {
    getTables().then(setTables).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReservation({
        ...formData,
        table_id: Number(formData.table_id),
        guest_count: Number(formData.guest_count),
      });
      setIsModalOpen(false);
      setFormData({
        table_id: "",
        customer_name: "",
        contact_number: "",
        reservation_time: "",
        guest_count: "",
      });
      toast.success("Reservasi berhasil dibuat!");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat reservasi");
    }
  };

  const handleStatusChange = async (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => {
    try {
      await changeStatus(id, action);
      toast.success(`Status reservasi berhasil diperbarui (${action}).`);
    } catch (err: any) {
      toast.error(err.message || "Gagal merubah status reservasi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarRange className="text-[#c94430]" /> Reservasi Meja
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola pemesanan meja dan status kedatangan pelanggan.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl"
        >
          <Plus size={18} className="mr-2" /> Buat Reservasi
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Meja & Tamu</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User size={14} /> {res.customer_name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Phone size={12} /> {res.contact_number || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#c94430]">
                      Meja {res.table?.table_number}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Users size={12} /> {res.guest_count} Orang
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {formatDateTime(res.reservation_time)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                        res.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : res.status === "confirmed"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : res.status === "completed"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {res.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {res.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(res.id, "confirm")}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs"
                        >
                          Confirm
                        </Button>
                      )}
                      {res.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(res.id, "complete")}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8 text-xs"
                        >
                          <CheckCircle2 size={14} className="mr-1" /> Complete
                        </Button>
                      )}
                      {(res.status === "pending" ||
                        res.status === "confirmed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(res.id, "cancel")}
                          className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
                        >
                          <XCircle size={14} className="mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Buat Reservasi</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                required
                placeholder="Nama Pelanggan"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
              />
              <Input
                placeholder="Nomor Telepon (opsional)"
                value={formData.contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
              />
              <Input
                type="datetime-local"
                required
                value={formData.reservation_time}
                onChange={(e) =>
                  setFormData({ ...formData, reservation_time: e.target.value })
                }
              />
              <Input
                type="number"
                min="1"
                required
                placeholder="Jumlah Tamu"
                value={formData.guest_count}
                onChange={(e) =>
                  setFormData({ ...formData, guest_count: e.target.value })
                }
              />
              <Select
                required
                value={formData.table_id}
                onValueChange={(v) => setFormData({ ...formData, table_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Meja..." />
                </SelectTrigger>
                <SelectContent>
                  {tables
                    .filter((t) => t.status !== "maintenance")
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        Meja {t.table_number} ({t.capacity} kursi) - {t.status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#c94430] text-white"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
