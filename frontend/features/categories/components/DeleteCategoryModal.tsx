"use client";

import { X, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  category: any;
  isSubmitting: boolean;
  errorWarning: string | null;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  category,
  isSubmitting,
  errorWarning,
}: DeleteCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-white relative animate-in zoom-in-95 duration-200">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {errorWarning ? (
          /* TAMPILAN JIKA DIBLOKIR UTK DIHAPUS (REJECTED STATE) */
          <div className="text-center pt-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 border border-amber-100 shadow-sm">
              <AlertTriangle size={32} />
            </div>

            <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-3">
              Kategori Terkunci
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
              Kategori{" "}
              <span className="font-bold text-slate-800">
                "{category?.name}"
              </span>{" "}
              belum bisa dihapus karena masih terikat dengan beberapa menu aktif
              di katalog restoran Anda.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left mb-6 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700 flex items-center gap-1">
                <AlertCircle size={13} className="text-slate-400" /> Solusi
                Langkah:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Buka menu Manajemen Katalog / Produk.</li>
                <li>
                  Pindahkan atau hapus menu yang menggunakan kategori ini.
                </li>
                <li>Kembali kemari untuk menghapus kategori.</li>
              </ol>
            </div>

            <Button
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-md"
            >
              Saya Mengerti
            </Button>
          </div>
        ) : (
          /* TAMPILAN NORMAL (CONFIRMATION STATE) */
          <div className="text-center pt-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#c94430] flex items-center justify-center mx-auto mb-5 border border-red-100 shadow-sm">
              <HelpCircle size={32} />
            </div>

            <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-2">
              Hapus Kategori?
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 px-4">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <span className="font-bold text-slate-800">
                "{category?.name}"
              </span>
              ? Tindakan ini bersifat permanen.
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-12 rounded-2xl text-slate-600 hover:bg-slate-100 font-semibold transition-all"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-2xl bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold shadow-lg shadow-[#c94430]/25 transition-all duration-300"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
