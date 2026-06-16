"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // PERBAIKAN 1: Ambil 'data.error' karena route.ts mengirim { error: ... }
        setError(data.error || "Akses ditolak. Periksa kredensial Anda.");
        setLoading(false);
        return;
      }

      // PERBAIKAN 2: Langsung ke data.user.role, tidak perlu data.data.user.role
      if (data.user.role !== "admin") {
        setError("Anda tidak memiliki otoritas sebagai Administrator.");
        setLoading(false);
        return;
      }

      // Login sukses
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan sistem pada aplikasi frontend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-800 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#c94430] rounded-full blur-[120px] opacity-20"></div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-16 mb-2">
            <Image
              src="/images/logo.png"
              alt="BiteBox Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-slate-200">
            Secure Admin Portal
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 tracking-tight border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Email Administrator
            </label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bitebox.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-semibold py-3 rounded-xl transition-colors tracking-tight disabled:opacity-70 mt-2 shadow-sm shadow-[#c94430]/20"
          >
            {loading ? "Otentikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 tracking-tight">
          BiteBox Internal System v1.0 <br /> Hanya untuk staf berwenang.
        </p>
      </div>
    </div>
  );
}
