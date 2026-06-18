"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.service";

export function useLogout(redirectTo = "/admin/login") {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push(redirectTo);
    } catch {
      console.error("Gagal logout");
    }
  };

  return {
    handleLogout,
  };
}
