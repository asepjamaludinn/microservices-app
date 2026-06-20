"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  labelEmail?: string;
  submitText?: string;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  labelEmail = "Email",
  submitText = "Masuk",
}: Props) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
        {labelEmail}
      </label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nama@email.com"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1 tracking-tight">
        Password
      </label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="h-11 rounded-xl bg-slate-50 border-slate-200"
        required
      />
    </div>
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white font-bold h-11 rounded-xl mt-4"
    >
      {loading ? "Memproses..." : submitText}
    </Button>
  </form>
);
