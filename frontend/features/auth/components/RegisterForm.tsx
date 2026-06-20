"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const RegisterForm = ({
  formData,
  handleChange,
  loading,
  onSubmit,
}: any) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Nama Lengkap
      </label>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nama lengkap"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Email
      </label>
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="nama@email.com"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Password
      </label>
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Minimal 8 karakter"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        minLength={8}
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Konfirmasi Password
      </label>
      <Input
        type="password"
        name="password_confirmation"
        value={formData.password_confirmation}
        onChange={handleChange}
        placeholder="Ketik ulang password"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        required
      />
    </div>
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-bold h-11 rounded-xl mt-2"
    >
      {loading ? "Memproses..." : "Daftar Sekarang"}
    </Button>
  </form>
);
