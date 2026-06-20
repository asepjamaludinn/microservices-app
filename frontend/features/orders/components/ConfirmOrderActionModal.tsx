import { Button } from "@/components/ui/button";

interface ConfirmOrderActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isProcessingAction: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmOrderActionModal({
  isOpen,
  title,
  message,
  isProcessingAction,
  onConfirm,
  onCancel,
}: ConfirmOrderActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm font-medium text-slate-500 mb-8">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-xl font-bold flex-1"
            disabled={isProcessingAction}
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessingAction}
            className="bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl font-bold flex-1 shadow-sm"
          >
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  );
}
