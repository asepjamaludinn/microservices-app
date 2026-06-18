"use client";

import { useState } from "react";
import { updatePassword } from "@/services/settings.service";

type Message = {
  type: "success" | "error" | "";
  text: string;
};

export function useSettings() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: "",
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      setMessage({
        type: "error",
        text: "Konfirmasi password baru tidak cocok!",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await updatePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      setMessage({
        type: "success",
        text: response.message,
      });

      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Terjadi kesalahan jaringan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    handleChange,
    handleUpdatePassword,
  };
}
