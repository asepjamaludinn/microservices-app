import { Button } from "@/components/ui/button";
import type { Menu } from "@/types/menu";

interface DeleteMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function DeleteMenuModal({
  isOpen,
  onClose,
  menu,
  onConfirm,
  isSubmitting,
}: DeleteMenuModalProps) {
  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Menu</h3>
        <p className="text-sm font-medium text-slate-500 mb-8">
          Apakah Anda yakin ingin menghapus {menu.name}?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl flex-1 border-slate-200 font-bold"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1"
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}
