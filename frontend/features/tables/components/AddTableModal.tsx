import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTable: any;
  setNewTable: (val: any) => void;
  handleAddSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function AddTableModal({
  isOpen,
  onClose,
  newTable,
  setNewTable,
  handleAddSubmit,
  isSubmitting,
}: AddTableModalProps) {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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
              onClick={onClose}
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
  );
}
