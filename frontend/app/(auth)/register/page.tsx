"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal melakukan registrasi");
        setLoading(false);
        return;
      }

      alert("Registrasi berhasil! Silakan login dengan akun baru Anda.");
      router.push("/login");
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
            Buat akun baru
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 tracking-tight border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Nama lengkap
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={formData.name}
              onChange={handleChange}
              placeholder="Misal: Gordon Ramsay"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
              Konfirmasi password
            </label>
            <input
              type="password"
              name="password_confirmation"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#c94430]/20 focus:border-[#c94430] outline-none transition-all tracking-tight"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Ketik ulang password"
              required
            />
          </div>

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
