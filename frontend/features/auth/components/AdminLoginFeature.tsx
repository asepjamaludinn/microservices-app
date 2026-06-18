"use client";

import Image from "next/image";
import { useLogin } from "@/hooks/use-login";

export default function AdminLoginFeature() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLogin("admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-800 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#c94430] rounded-full blur-[120px] opacity-20" />

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative z-10">
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
            Admin Portal
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 tracking-tight border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Email Administrator
            </label>

            <input
              type="email"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Password
            </label>

            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-medium py-2.5 rounded-xl transition-colors tracking-tight disabled:opacity-70 mt-4 shadow-sm shadow-[#c94430]/20"
          >
            {loading ? "Otentikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 tracking-tight mt-6">
          BiteBox Internal System <br /> Hanya untuk staf berwenang.
        </p>
      </div>
    </div>
  );
}
