"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/services/auth.service";

type RoleType = "admin" | "user";

export function useLogin(roleType: RoleType = "user") {
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
      const data = await loginUser({ email, password });

      if (roleType === "admin") {
        if (data.user.role !== "admin") {
          setError("Anda tidak memiliki otoritas sebagai Administrator.");
          return;
        }
        toast.success(`Selamat datang kembali, Admin ${data.user.name}!`);
        router.push("/admin/dashboard");
      } else {
        if (data.user.role === "admin") {
          setError(
            "Akun ini terdaftar sebagai Administrator. Silakan gunakan Admin Portal.",
          );
          return;
        }
        toast.success(`Selamat datang kembali, ${data.user.name}!`);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem pada aplikasi frontend.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
}
