"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCurrentUser } from "@/services/auth.service";

export function useCheckoutAuth() {
  const router = useRouter();

  const handleCheckout = async (afterCheck?: () => void) => {
    try {
      await getCurrentUser();
      router.push("/dashboard");
    } catch {
      toast.error("Silakan Login terlebih dahulu untuk melanjutkan pesanan.");
      router.push("/login");
    } finally {
      afterCheck?.();
    }
  };

  return {
    handleCheckout,
  };
}
