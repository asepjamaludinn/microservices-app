import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import type { RestaurantTable } from "@/types/table";

interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  tables: RestaurantTable[];
  isSubmitting: boolean; // Props baru
}

export default function ReservationFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  tables,
  isSubmitting,
}: ReservationFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] w-full max-w-lg p-8 sm:p-10 shadow-2xl border border-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Close di pojok kanan atas */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h3 className="font-extrabold text-3xl tracking-tight text-slate-900 mb-2">
            Buat Reservasi
          </h3>
          <p className="text-slate-500 text-sm">
            Silakan lengkapi detail informasi untuk pemesanan meja pelanggan.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
              Nama Pelanggan
            </label>
            <Input
              required
              placeholder="Cth: John Doe"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] transition-all text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
                No. Telepon
              </label>
              <Input
                placeholder="Cth: 0812345..."
                value={formData.contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] transition-all text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
                Waktu
              </label>
              <Input
                type="datetime-local"
                required
                value={formData.reservation_time}
                onChange={(e) =>
                  setFormData({ ...formData, reservation_time: e.target.value })
                }
                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] transition-all text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
                Tamu (Orang)
              </label>
              <Input
                type="number"
                min="1"
                required
                placeholder="Jumlah Tamu"
                value={formData.guest_count}
                onChange={(e) =>
                  setFormData({ ...formData, guest_count: e.target.value })
                }
                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] transition-all text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
                Pilihan Meja
              </label>
              <Select
                required
                value={formData.table_id}
                onValueChange={(v) => setFormData({ ...formData, table_id: v })}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-[#c94430]/20 focus:border-[#c94430] transition-all text-base">
                  <SelectValue placeholder="Pilih Meja..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {tables
                    .filter((t) => t.status !== "maintenance")
                    .map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id.toString()}
                        className="rounded-lg cursor-pointer"
                      >
                        Meja {t.table_number} ({t.capacity} kursi) - {t.status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 h-12 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold transition-all"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#c94430] to-[#e05640] hover:from-[#b03a28] hover:to-[#c94430] text-white font-semibold shadow-lg shadow-[#c94430]/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Reservasi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
