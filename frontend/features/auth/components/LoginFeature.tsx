"use client";

import Link from "next/link";
import Image from "next/image";
import { useLogin } from "@/hooks/use-login";
import { LoginForm } from "./LoginForm";

export default function LoginFeature() {
  const loginHooks = useLogin("user");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full max-w-md">
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

        {loginHooks.error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 text-center border border-red-100">
            {loginHooks.error}
          </div>
        )}

        <LoginForm
          {...loginHooks}
          onSubmit={loginHooks.handleLogin}
          labelEmail="Email"
          submitText="Masuk"
        />

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
