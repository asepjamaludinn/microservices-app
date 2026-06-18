"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";

export function useCheckoutAuth() {
  const router = useRouter();

  const handleCheckout = async (afterCheck?: () => void) => {
    try {
      await getCurrentUser();
      router.push("/dashboard");
    } catch {
      alert("Silakan Login terlebih dahulu untuk melanjutkan pesanan.");
      router.push("/login");
    } finally {
      afterCheck?.();
    }
  };

  return {
    handleCheckout,
  };
}
