"use client";

import Link from "next/link";
import Image from "next/image";
import { useRegister } from "@/hooks/use-register";

export default function RegisterFeature() {
  const { formData, error, loading, handleChange, handleRegister } =
    useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-64 h-24 mb-1">
            <Image
              src="/images/logo.png"
              alt="BiteBox Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tighter">
            Buat akun baru
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 tracking-tight border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nama lengkap"
            required
          />

          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            required
          />

          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
          />

          <input
            type="password"
            name="password_confirmation"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Konfirmasi password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-medium py-2.5 rounded-xl transition-colors tracking-tight disabled:opacity-70 mt-2 shadow-sm shadow-[#c94430]/20"
          >
            {loading ? "Memproses..." : "Daftar sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 tracking-tight mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#c94430] hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
