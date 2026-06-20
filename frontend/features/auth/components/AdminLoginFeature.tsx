"use client";

import Image from "next/image";
import { useLogin } from "@/hooks/use-login";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginFeature() {
  const loginHooks = useLogin("admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-800 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#c94430] rounded-full blur-[120px] opacity-20" />

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-20 mb-2">
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

        {loginHooks.error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 text-center border border-red-100">
            {loginHooks.error}
          </div>
        )}

        <AdminLoginForm {...loginHooks} onSubmit={loginHooks.handleLogin} />

        <p className="text-center text-sm text-slate-500 tracking-tight mt-8">
          BiteBox Internal System <br /> Hanya untuk staf berwenang.
        </p>
      </div>
    </div>
  );
}
