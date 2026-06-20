"use client";

import { useSettings } from "@/hooks/use-settings";
import ChangePasswordCard from "./ChangePasswordCard";

export default function SettingsFeature() {
  const { formData, loading, handleChange, handleUpdatePassword } =
    useSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola preferensi akun dan keamanan Anda di sini.
        </p>
      </div>

      <ChangePasswordCard
        formData={formData}
        loading={loading}
        handleChange={handleChange}
        handleUpdatePassword={handleUpdatePassword}
      />
    </div>
  );
}
