import { Button } from "@/components/ui/button";
import { Ingredient } from "@/types";

interface DeleteIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIngredient: Ingredient | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function DeleteIngredientModal({
  isOpen,
  onClose,
  selectedIngredient,
  onConfirm,
  isSubmitting,
}: DeleteIngredientModalProps) {
  if (!isOpen || !selectedIngredient) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Hapus Bahan Baku
        </h3>
        <p className="text-sm font-medium text-slate-500 mb-8">
          Yakin ingin menghapus <strong>{selectedIngredient.name}</strong>? Jika
          item ini digunakan pada resep, proses hapus akan ditolak oleh sistem.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl flex-1 font-bold"
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
