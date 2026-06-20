import { KeyRound } from "lucide-react";

interface ChangePasswordCardProps {
  formData: any;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdatePassword: (e: React.FormEvent) => void;
}

export default function ChangePasswordCard({
  formData,
  loading,
  handleChange,
  handleUpdatePassword,
}: ChangePasswordCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 p-6 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm text-[#c94430]">
            <KeyRound size={20} strokeWidth={2.5} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Ubah Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pastikan Anda menggunakan password yang kuat dan unik.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password Lama
            </label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all text-sm"
              placeholder="Masukkan password saat ini"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all text-sm"
              placeholder="Minimal 8 karakter, kombinasi huruf & angka"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all text-sm"
              placeholder="Ketik ulang password baru"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c94430] hover:bg-[#b03a28] text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70 shadow-sm"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
