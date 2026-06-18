"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updatePassword } from "@/services/settings.service";

export function useSettings() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Konfirmasi password baru tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const response = await updatePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      toast.success(response.message || "Password berhasil diperbarui!");

      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleUpdatePassword,
  };
}