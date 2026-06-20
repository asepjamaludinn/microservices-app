"use client";

import Link from "next/link";
import Image from "next/image";
import { useRegister } from "@/hooks/use-register";
import { RegisterForm } from "./RegisterForm";

export default function RegisterFeature() {
  const registerHooks = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
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

        {registerHooks.error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 text-center border border-red-100">
            {registerHooks.error}
          </div>
        )}

        <RegisterForm
          {...registerHooks}
          onSubmit={registerHooks.handleRegister}
        />

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
