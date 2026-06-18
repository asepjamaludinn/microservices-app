"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerUser } from "@/services/auth.service";

export function useRegister() {
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      await registerUser(formData);
      toast.success(
        "Registrasi berhasil! Silakan login dengan akun baru Anda.",
      );
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal melakukan registrasi",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleRegister,
  };
}
