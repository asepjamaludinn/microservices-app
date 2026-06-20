"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCurrentUser } from "@/services/auth.service";

export function useCheckoutAuth() {
  const router = useRouter();

  const handleCheckout = async (afterCheck?: () => void) => {
    try {
      const response = await getCurrentUser();
      const user = response.user;

      if (user.role === "admin") {
        toast.error(
          "Anda sedang login sebagai Admin. Silakan logout admin atau login sebagai user.",
        );
        router.push("/admin/dashboard");
        return;
      }

      router.push("/dashboard");
    } catch {
      toast.error("Silakan login terlebih dahulu untuk melanjutkan pesanan.");
      router.push("/login");
    } finally {
      afterCheck?.();
    }
  };

  return {
    handleCheckout,
  };
}
