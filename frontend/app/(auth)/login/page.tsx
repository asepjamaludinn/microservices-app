"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
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
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }

      alert(`Selamat datang kembali, ${data.user.name}!`);
      router.push("/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

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
            Masuk ke akun
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
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
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
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-medium py-2.5 rounded-xl transition-colors tracking-tight disabled:opacity-70 mt-4 shadow-sm shadow-[#c94430]/20"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 tracking-tight mt-6">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#c94430] hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
