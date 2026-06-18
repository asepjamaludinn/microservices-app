"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function SettingsFeature() {
  const { formData, loading, message, handleChange, handleUpdatePassword } =
    useSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola preferensi akun dan keamanan Anda di sini.
        </p>
      </div>

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
          {message.text && (
            <div
              className={`px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {message.type === "success" && <ShieldCheck size={18} />}
              {message.text}
            </div>
          )}

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
    </div>
  );
}
